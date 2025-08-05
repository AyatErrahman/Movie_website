import { Client, Databases, ID, Query } from 'appwrite';


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
          .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
          .setProject(PROJECT_ID);
          
const database = new Databases(client); 


export const updateSearchCount = async (searchTerm, movie ) => {
    console.log('updateSearchCount called with:', { searchTerm, movie }); // DEBUG

    // 1. Use Appwrite sdk to update the search count
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, 
            [ Query.equal('searchTerm', searchTerm)]
        );
        
        console.log('Existing documents:', result.documents); // DEBUG

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            console.log('Updating existing document:', doc.$id); // DEBUG
            // update the count
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            )  
        }else{
            console.log('Creating new document'); // DEBUG
            await database.createDocument(
                DATABASE_ID, COLLECTION_ID, ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    //title: movie.title,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            )
        }
    } catch (error) {
        console.error('Error updating search count:', error);
        console.error('Error details:', error.message); // DEBUG
    }
    // 2. if it does, update the count
    // 3. if it does not, create a new document with the search term and count 1


    
         
    
}


export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,  [ Query.limit(5), Query.orderDesc('count')]
        );

        return result.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }

}
