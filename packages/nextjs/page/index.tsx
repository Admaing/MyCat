// import { useState, useEffect } from "react";
// import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth"; // 假设你有这些hooks
// // import MyCatContract from "../artifacts/MyCatContract.json";
// // import deployedAddress from "../deployedAddress.json"; // 包含部署的合约地址

// interface Cat {
//   id: string;
//   name: string;
//   gender: string;
//   imageURI: string;
// }

// const contractName = "MyCatContract";

// const Home = () => {
//   const [newCatName, setNewCatName] = useState<string>("");
//   const [newCatGender, setNewCatGender] = useState<string>("");
//   const [imageURI, setImageURI] = useState<string>("");

//   // 使用Scaffold-ETH提供的读取hook读取猫咪数量
//   const { data: catCount } = useScaffoldContractRead({
//     contractName,
//     methodName: "catCounter",
//     args: []
//   });

//   const { data: cats, isLoading: loadingCats } = useScaffoldContractRead({
//     contractName,
//     methodName: "getCats",
//     args: []
//   });

//   const { write: mintCat } = useScaffoldContractWrite({
//     contractName,
//     methodName: "mintCat",
//     args: [newCatName, newCatGender, imageURI]
//   });

//   return (
//     <div className="container mx-auto">
//       <h1>Cat NFT Dapp</h1>

//       <input
//         type="text"
//         placeholder="Cat Name"
//         value={newCatName}
//         onChange={(e) => setNewCatName(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Cat Gender"
//         value={newCatGender}
//         onChange={(e) => setNewCatGender(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Image URI"
//         value={imageURI}
//         onChange={(e) => setImageURI(e.target.value)}
//       />
//       <button onClick={mintCat}>Mint Cat</button>

//       <h2>Your Cats</h2>
//       <div className="grid grid-cols-3 gap-4">
//         {!loadingCats && cats && cats.length > 0 ? (
//           cats.map((cat: Cat, index: number) => (
//             <div key={index} className="border p-4">
//               <h3>{cat.name}</h3>
//               <p>Gender: {cat.gender}</p>
//               <img src={cat.imageURI} alt={`${cat.name} image`} />
//             </div>
//           ))
//         ) : (
//           <p>Loading cats...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
