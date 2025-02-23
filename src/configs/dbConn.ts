import mongoose from "mongoose";

/**
 * Connecte l'application à la base de données MongoDB.
 */
// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect("mongodb+srv://cedricngangue08:iA20XwVr0mvrWZ8p@cluster0.ai5pv.mongodb.net/Cluster0?retryWrites=true&w=majority");
//     console.log("Connected to MongoDB")
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err)
//   }
// }


const connectDB = async (): Promise<void> => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("URI:", process.env.DATABASE_URI); // Remplacez par une variable d'environnement pour plus de sécurité

    await mongoose.connect(process.env.DATABASE_URI || "mongodb+srv://cedricngangue08:rludk68ZjTVuzLdQ@cluster.4rclv.mongodb.net/cluster?retryWrites=true&w=majority")
   
    
   
    console.log("Connected to MongoDB")
  } catch (err) {
    console.error("Error connecting to MongoDB:", err)
  }
};


export default connectDB;
