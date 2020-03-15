module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/covid-19-nsw/" : "/",
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html",
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: "COVID-19 statistics for NSW"
    }
  }
};
