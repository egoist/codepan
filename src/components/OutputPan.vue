<template>
  <div
    class="output-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('output')"
  >
    <div class="pan-head">Output</div>
    <div ref="output" class="output-iframe" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import {
  getHumanlizedTransformerName,
  createElement,
  createElementHTML,
} from "@/utils";
import axios from "axios";
import notie from "notie";
import * as transform from "@/utils/transform";
import Event from "@/utils/event";
import getScripts from "@/utils/get-scripts";
import proxyConsole from "!babel-loader?presets[]=@babel/env!raw-loader!buble-loader!@/utils/proxy-console";

const sandboxAttributes = [
  "allow-modals",
  "allow-forms",
  "allow-pointer-lock",
  "allow-popups",
  "allow-same-origin",
  "allow-scripts",
];

const makeGist = (data, { showPans, activePan }) => {
  const files = {};

  const manifest = {
    ...data,
    showPans,
    activePan,
  };

  files["codepan.json"] = {
    content: JSON.stringify(manifest, null, 2),
  };

  return files;
};

export default {
  name: "OutputPan",
  data() {
    return {
      frame: null,
    };
  },
  computed: {
    ...mapState([
      "js",
      "css",
      "html",
      "visiblePans",
      "activePan",
      "githubToken",
      "iframeStatus",
    ]),
    ...mapGetters(["isLoggedIn", "canUpdateGist"]),
    isActivePan() {
      return this.activePan === "output";
    },
  },
  created() {
    window.addEventListener("message", this.listenIframe);

    Event.$on("run", () => this.run());
    Event.$on("save-gist", (saveNew) => {
      this.saveGist({ token: this.githubToken, saveNew });
    });
  },
  methods: {
    ...mapActions([
      "addLog",
      "clearLogs",
      "setActivePan",
      "setBoilerplate",
      "editorSaved",
      "editorSaving",
      "editorSavingError",
      "setIframeStatus",
      "transform",
    ]),
    getHumanlizedTransformerName,

    rebuildFrame(content) {
      this.frame = createElement("iframe", "", {
        sandbox: sandboxAttributes.join(" "),
        scrolling: "yes",
        style: "flex: 1;",
        frameborder: "0",
      });

      if (this.$refs.output) {
        while (this.$refs.output.hasChildNodes()) {
          this.$refs.output.removeChild(this.$refs.output.firstChild);
        }
        this.$refs.output.appendChild(this.frame);
      }

      this.frame.contentDocument.open();
      this.frame.contentDocument.write(content);
      this.frame.contentDocument.close();
    },

    async listenIframe({ data = {} }) {
      if (data.type === "iframe-error") {
        this.addLog({ type: "error", message: data.stack || data.message });
        this.setIframeStatus("error");
      } else if (data.type === "codepan-console") {
        if (data.method === "clear") {
          this.clearLogs();
        } else {
          this.addLog({ type: data.method, message: data.args.join("") });
        }
      } else if (data.type === "codepan-make-output-active") {
        this.setActivePan("output");
      } else if (data.type === "codepan-set-boilerplate" && data.boilerplate) {
        await this.setBoilerplate(JSON.parse(data.boilerplate));
        Event.$emit("refresh-editor");
      } else if (data.type === "iframe-success") {
        this.setIframeStatus("success");
      }
    },

    async run() {
      this.setIframeStatus("loading");

      const transformed = { html: "", js: "", css: "" };
      const scripts = [];

      await this.transform(true);

      try {
        await Promise.all([
          transform.html(this.html).then((code) => {
            transformed.html = code;
          }),
          transform
            .js(this.js)
            .then((code) => getScripts(code, scripts))
            .then((code) => {
              transformed.js = code;
            }),
          transform.css(this.css).then((code) => {
            transformed.css = code;
          }),
        ]).catch((err) => {
          throw err;
        });

        localStorage.setItem("codepan.css", this.css.code);
        localStorage.setItem("codepan.html", this.html.code);
        localStorage.setItem("codepan.js", this.js.code);
      } catch (err) {
        this.setIframeStatus("error");

        return this.addLog({
          type: "error",
          message: err.stack || err.message,
        });
      }

      await this.transform(false);

      const head = [
        createElementHTML("style", transformed.css),
        createElementHTML(
          "script",
          `window.process = window.process || { env: { NODE_ENV: 'development' } }`
        ),
        createElementHTML("script", proxyConsole),
        ...scripts.map((script) =>
          createElementHTML("script", "", {
            type: script.module.match(/[?&]type=module/) ? "module" : "",
            src: `https://unpkg.com/${script.name}`,
          })
        ),
      ].join("\n");

      const body = [
        createElementHTML("script", "console.clear();"),
        transformed.html,
        createElementHTML("script", transformed.js),
      ].join("\n");

      this.rebuildFrame(`<!DOCTYPE html>
      <html>
        <head>${head}</head>
        <body>${body}</body>
      </html>`);

      this.setIframeStatus("ready");
    },

    /**
     * Save gist
     * When you are not logged in (no github token) it saves as guest gist
     * Otherwise it creates or updates gist
     */
    async saveGist({ token, saveNew } = {}) {
      this.editorSaving();
      try {
        const files = makeGist(
          {
            js: this.js,
            css: this.css,
            html: this.html,
          },
          {
            showPans: this.visiblePans,
            activePan: this.activePan,
          }
        );
        const params = {};
        if (token) {
          // eslint-disable-next-line camelcase
          params.access_token = token;
        }
        const shouldUpdateGist = this.canUpdateGist && !saveNew;
        const url = `https://api.github.com/gists${
          shouldUpdateGist ? `/${this.$route.params.gist}` : ""
        }`;
        const method = shouldUpdateGist ? "PATCH" : "POST";
        const { data } = await axios(url, {
          params,
          method,
          data: {
            public: false,
            files,
          },
        });

        if (shouldUpdateGist) {
          this.editorSaved();
        } else {
          this.$router.push(`/gist/${data.id}`);
          if (token) {
            // Update gist id in the description of newly created gist
            axios(`https://api.github.com/gists/${data.id}`, {
              method: "PATCH",
              params,
              data: {
                description: `Try it online! https://codepan.net/gist/${data.id}`,
              },
            }).catch((err) => console.log(err));
          }
        }
      } catch (err) {
        this.editorSavingError();
        if (err.response) {
          notie.alert({
            type: "error",
            text: err.response.data.message,
          });
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
$statusSize = 12px;

.output-pan {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.output-iframe {
  overflow: hidden;
  display: flex;
  flex: 1;
  margin-top: -1px;

  &.disable-mouse-events {
    pointer-events: none;
  }
}
</style>
