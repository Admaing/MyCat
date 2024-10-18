// import React, { useEffect, useState } from "react";
// import { useAccount, useCoone useNetwork, useProvider, useSigner } from "wagmi";
// import { ethers } from "ethers";
// import { useScaffoldReadContract,useScaffoldWriteContract  } from "../hooks/scaffold-eth";
// import contracts from "../contracts/contract";

// interface Cat {
//   id: number;
//   name: string;
//   gender: string;
//   imageURI: string;
// }

// const YourGardenComponent: React.FC = () => {
//   const { data: account } = useAccount();
//   const { chain } = useNetwork();
//   const provider = useProvider();
//   const { data: signer } = useSigner();

//   const [form, setForm] = useState({ name: "", gender: "", imageURI: "" });
//   const [cats, setCats] = useState<Cat[]>([]);

//   if (!chain) return <div>Loading...</div>;

//   const contractAddress = contracts[chain.id][0].contracts.YourGarden.address;
//   const contractAbi = contracts[chain.id][0].contracts.YourGarden.abi;

//   // Reading data from the contract
//   const { data: totalCats, refetch: refetchTotalCats } = useScaffoldReadContract(contractAddress, contractAbi, "catCounter", []);

//   // Writing data to the contract
//   const { write: mintCat, state: mintState } = useContractWrite(contractAddress, contractAbi, "mintCat");

//   useEffect(() => {
//     if (totalCats) {
//       fetchCats(totalCats.toNumber());
//     }
//   }, [totalCats]);

//   const fetchCats = async (total: number) => {
//     const _cats: Cat[] = [];
//     for (let i = 1; i <= total; i++) {
//       const cat = await (await provider.getContract(contractAddress).cats(i));
//       _cats.push({
//         id: i,
//         name: cat.name,
//         gender: cat.gender,
//         imageURI: cat.imageURI,
//       });
//     }
//     setCats(_cats);
//   };

//   const handleMintCat = async () => {
//     if (!account) {
//       alert("Connect your wallet first!");
//       return;
//     }
//     await mintCat([form.name, form.gender, form.imageURI], { from: account.address });
//     refetchTotalCats();
//   };

//   return (
//     <div>
//       <h1>Your Garden</h1>
//       <div>
//         Cats Count: {totalCats?.toNumber()}
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Name"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Gender"
//           onChange={(e) => setForm({ ...form, gender: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Image URI"
//           onChange={(e) => setForm({ ...form, imageURI: e.target.value })}
//         />
//         <button onClick={handleMintCat}>Mint Cat</button>
//       </div>
//       <div>
//         {cats.map((cat) => (
//           <div key={cat.id}>
//             <img src={cat.imageURI} alt={cat.name} />
//             <p>Name: {cat.name}</p>
//             <p>Gender: {cat.gender}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default YourGardenComponent;
