// frontend/js/app.js
const { ethers } = require("../ethers");
const ipfsClient = require('ipfs-http-client');
const fs = require('fs');
const fetch = require('node-fetch');

require('dotenv').config();

const pinataApiKey = process.env.PINATA_API_KEY;

const downloadFile = async (ipfsCid, filePath) => {
    try {
        const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${ipfsCid}`);

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const buffer = await response.buffer();

        fs.writeFile(filePath, buffer, (error) => {
            if (error) {
                console.error('Failed to save the file:', error);
            } else {
                console.log(`File saved to ${filePath}`);
            }
        });
    } catch (error) {
        console.error('Failed to download the file:', error);
    }
};

async function mintArtwork() {
    // ... (existing mintArtwork function)

    // After minting, refresh the displayed NFTs
    displayNFTs();
}

async function uploadToIPFS(file) {
    // Create an IPFS client with the connection details
    const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Use ipfs.add to upload the file to IPFS
    const result = await ipfs.add(fileBuffer);

    // Return the IPFS hash of the uploaded file
    return result.cid.toString();
}

async function handleFileUpload() {
    try {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (file) {
            const ipfsHash = await uploadToIPFS(file);
            alert("File uploaded to IPFS. IPFS Hash: " + ipfsHash);

            // Set the IPFS hash in the input field
            const ipfsHashInput = document.getElementById("ipfsHashInput");
            ipfsHashInput.value = ipfsHash;

            // Download the file from IPFS and save it locally
            await downloadFile(ipfsHash, 'path/to/your/local/file.png');

            // Display the image using IPFS URL
            const galleryContainer = document.getElementById("nftGallery");
            const imgSrc = `https://ipfs.io/ipfs/${ipfsHash}`;
            const nftElement = document.createElement("div");
            nftElement.classList.add("nft");
            nftElement.innerHTML = `
                <p>Owner: ${getCurrentUserAddress()}</p>
                <img src="${imgSrc}" alt="NFT">
            `;
            galleryContainer.appendChild(nftElement);
        } else {
            console.log("No file selected.");
        }
    } catch (error) {
        console.error("Error handling file upload:", error);
        alert("Error handling file upload. Check the console for details.");
    }
}

async function getCurrentUserAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return await signer.getAddress();
}

async function displayNFTs() {
    // Add code to display NFTs in the gallery
    // You can use the gallery container (div with id="nftGallery") to append NFTs dynamically
    // Example: const galleryContainer = document.getElementById("nftGallery");
    // Update the galleryContainer with the newly minted NFTs
}

// Initial display of NFTs when the page loads
displayNFTs();
