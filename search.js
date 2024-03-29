const body = document.querySelector('body');
const inputSearch = document.querySelector('#search-query');
const heading = document.querySelector('#heading');
const imagesContainer = document.querySelector('.images-container');
const showMoreButton = document.querySelector('#show-more-btn');


let currentPage = 1;


// Retrieve the query from local storage
let userQuery = localStorage.getItem('userQuery');

// Use the userQuery as needed
(() => {
    inputSearch.value = userQuery;
    heading.innerText = userQuery;

    // clear previous images from the imagesContainer
    imagesContainer.innerHTML = "";
    currentPage = 1;

    getPhoto();

})();


inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (inputSearch.value !== "") {
            userQuery = inputSearch.value.trim();
            console.log(userQuery);
            inputSearch.value = userQuery;
            heading.innerText = userQuery;

            // clear previous images from the imagesContainer
            imagesContainer.innerHTML = "";

            currentPage = 1;

            getPhoto();

        }
    }
});


async function getPhoto() {
    try {

        const apiKey = 'I2B_JfYcK7JZrt9SNjgcvCdq89zRMKrNyKIYeV4lN88';

        const URL = `https://api.unsplash.com/search/photos?page=${currentPage}&query=${userQuery}&client_id=${apiKey}`;

        let response = await fetch(URL);
        let data = await response.json();

        // Access the array of photos in the results property
        const photos = data.results;

        // Display URLs of the first 10 photos in the console
        for (let i = 0; i < Math.min(9, photos.length); i++) {
            console.log('Photo URL:', photos[i].urls.full);
            setPhoto(photos[i].urls.full);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function setPhoto(imageURL) {
    let div = document.createElement('div');
    let downloadDiv = document.createElement('div');

    div.classList.add('images');
    div.style.backgroundImage = `url(${imageURL})`;
    div.style.backgroundSize = 'cover';

    downloadDiv.classList.add('download-images');
    downloadDiv.innerHTML = `
                            <div class="download-images-div" id="like-icon" ><i class="fa-solid fa-heart"></i></div>
                            <div class="download-images-div" id="download-icon" ><i class="fa-solid fa-arrow-down"></i></div>
                            `;

    downloadDiv.querySelector("#download-icon").addEventListener('click', () => {
        // Create a temporary anchor element
        let downloadAnchor = document.createElement("a");
        downloadAnchor.href = imageURL;
        downloadAnchor.download = "downloaded_image.jpg"; // Provide a filename for the downloaded file
        downloadAnchor.click();
    });

    div.addEventListener('mouseenter', () => {
        div.appendChild(downloadDiv);
    });

    div.addEventListener('mouseleave', () => {
        div.removeChild(downloadDiv);
    });

    imagesContainer.appendChild(div);
}


showMoreButton.addEventListener('click', () => {
    currentPage += 1;
    getPhoto();
})