const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

// Listen for the search form submission
form.addEventListener("submit", async function (event) {
    // Prevent the page from reloading
    event.preventDefault();

    // Get the search text
    const query = input.value.trim();

    // Ignore empty searches
    if (query === "") {
        return;
    }

    // Clear previous results
    results.innerHTML = "";
    resultCount.textContent = "";

    try {
        // Create the Wikimedia Commons API URL
        const url =
            `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

        // Fetch image data from the API
        const response = await fetch(url);

        // Check whether the request was successful
        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        // Convert the response into JSON
        const data = await response.json();

        // Get the image results
        const pages = Object.values(data.query?.pages || {});

        // Display the result count
        resultCount.textContent =
            `Showing ${pages.length} results for "${query}"`;

        // Create a card for each image
        pages.forEach(function (page) {
            const imageInfo = page.imageinfo?.[0];

            // Skip results without image information
            if (!imageInfo) {
                return;
            }

            // Create the image card
            const card = document.createElement("div");
            card.className = "image-card";

            // Create the image
            const image = document.createElement("img");
            image.src = imageInfo.thumburl || imageInfo.url;
            image.alt = page.title.replace("File:", "");
            image.loading = "lazy";

            // Create the image caption
            const caption = document.createElement("p");
            caption.textContent = page.title.replace("File:", "");

            // Create a link to the original image page
            const link = document.createElement("a");
            link.href = imageInfo.descriptionurl || imageInfo.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            // Add the image and caption to the card
            link.appendChild(image);
            card.appendChild(link);
            card.appendChild(caption);

            // Add the card to the results container
            results.appendChild(card);
        });

    } catch (error) {
        // Display an error message if the request fails
        console.error("Error fetching images:", error);
        resultCount.textContent =
            "Unable to load images. Please try again.";
    }
});
```