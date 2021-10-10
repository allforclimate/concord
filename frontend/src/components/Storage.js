import { NFTStorage, File } from 'nft.storage'

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZEOTQxQjMwRUJBQkI0RDIxMGUzMjI0OTYzRjU3REYzMzY5MWUwZjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMzg4NDUwMzQ4OCwibmFtZSI6IktpZXogREFPIn0.3J6WqTPIyqY3RW2UrTMrOqgLpE3-YfbBo_Sp9OLx7wk'
const client = new NFTStorage({ token: apiKey })

const Storage = () => {

    const uploadFile = async () => {
        
        const metadata = await client.store({
            name: 'mybill',
            description: 'I paid $200 USD for this.',
            image: new File([/* data */], './public/mybill.jpg', { type: 'image/jpg' })
          })
          console.log(metadata.url)
        
    }

    return (
        <div className="wallet-info">
            <p>Add a file to IPFS+Filecoin</p>
            <button className="button-standard" onClick={uploadFile}>
            Upload
        </button>
        </div>
        );
    };

export default Storage;