import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "rgb(235, 28, 36)",
        maincolor2: "#1b78ef",
      },
    },
  },
  plugins: [],
});
