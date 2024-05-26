const currencyFormatter = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
}).format(value);

export default currencyFormatter;