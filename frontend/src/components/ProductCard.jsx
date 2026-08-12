import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  let imageUrl = null;

  if (product.image) {
    if (
      product.image.startsWith("http://") ||
      product.image.startsWith("https://")
    ) {
      // Backend already gives complete URL
      imageUrl = product.image;
    } else {
      // Backend gives /media/...
      imageUrl = `${BASEURL}${product.image.startsWith("/") ? "" : "/"}${product.image}`;
    }
  }

  console.log("Product:", product.name);
  console.log("Image:", product.image);
  console.log("Final Image URL:", imageUrl);

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform p-4 cursor-pointer">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover rounded-lg mb-4"
            onError={(e) => {
              console.error("Image failed:", imageUrl);
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.classList.remove("hidden");
              e.currentTarget.nextElementSibling.classList.add("flex");
            }}
          />
        ) : null}

        <div
          className={`w-full h-56 bg-gray-200 rounded-lg mb-4 items-center justify-center ${
            imageUrl ? "hidden" : "flex"
          }`}
        >
          No Image
        </div>

        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        <p className="text-gray-600 font-medium">
          ₹{product.price}
        </p>

      </div>
    </Link>
  );
}

export default ProductCard;