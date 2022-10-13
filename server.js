const Koa = require("koa");
const Router = require("koa-router");
const views = require("koa-views");
const koaBody = require("koa-body");
const serve = require("koa-static");
const helmet = require("koa-helmet");
const csrf = require("koa-csrf");
const session = require("koa-generic-session");
const flash = require("koa-better-flash");
const path = require("path");

const app = new Koa();
const router = new Router();

app.keys = ["dajiidjmansdiqweiqjasdapeqwdasdadasdasdadadads"];
const sessionOptions = {
  key: "koa.sess",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true,
    httpOnly: true
  },
};

app.use(
  views(path.resolve(__dirname, "src", "views"), {
    extension: "ejs",
    map: { ejs: "ejs" },
  })
);

app.use(serve(path.resolve(__dirname, "public")));
app.use(koaBody());

app.use(helmet());
app.use(session(sessionOptions));
app.use(flash());
app.use(new csrf({
  invalidTokenMessage: "Invalid CSRF token",
  invalidTokenStatusCode: 403,
  excludedMethods: [ "GET", "HEAD", "OPTIONS" ],
  disableQuery: false
}));

app.use(async (ctx, next) => {
  ctx.state = { csrf: ctx.csrf }
  await next();
});

app.use(router.routes());

router.get("/", async (ctx) => {
  await ctx.render("home");
});

router.get("/contato", async (ctx) => {
  await ctx.render("contato");
});

router.post("/contato", (ctx) => {
  ctx.body = {
    email: ctx.request.body.email,
    mensagem: ctx.request.body.mensagem,
  };
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
