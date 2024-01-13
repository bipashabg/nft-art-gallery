// frontend/js/app.js
const { ethers } = require("ethers");

async function mintArtwork() {
    // ... (existing mintArtwork function)

    // After minting, refresh the displayed NFTs
    displayNFTs();
}

async function displayNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const ArtGallery = await ethers.getContractFactory("ArtGallery");
    const artGallery = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", ArtGallery.interface, provider);

    const to = "0x866e6B197b6bC4e38b14034f3B80B3e9811aA1F0";

    // Minting without setting tokenURI
    await artGallery.connect(admin).mint(to);

    

    const galleryContainer = document.getElementById("nftGallery");
    galleryContainer.innerHTML = ""; 


    try {
        const totalSupply = await artGallery.totalSupply();
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
            const owner = await artGallery.ownerOf(tokenId);
            const imgSrc = `https://ipfs.io/ipfs/${await artGallery.tokenURI(tokenId)}`;

            // Create HTML elements for each NFT
            const nftElement = document.createElement("div");
            nftElement.classList.add("nft");
            nftElement.innerHTML = `
                <p>Owner: ${owner}</p>
                <img src="${imgSrc}" alt="NFT ${tokenId}">
            `;

            // Append the NFT element to the gallery container
            galleryContainer.appendChild(nftElement);
        }
    } catch (error) {
        console.error("Error fetching and displaying NFTs:", error);
    }
}

// Initial display of NFTs when the page loads
displayNFTs();
