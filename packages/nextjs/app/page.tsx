"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  console.log("address", connectedAddress);
  const { data: myCat } = useScaffoldReadContract({
    contractName: "MyCatContract",
    functionName: "getMyCats",
  });
  const { writeContractAsync: mintCat } = useScaffoldWriteContract("MyCatContract");
  const catName = "Kittyww"; // 设置猫咪的名称，可以根据需要动态传入
  const catGender = "Female"; // 设置猫咪的性别，可以根据需要动态传入
  const catImageURI = "http://example.com/kitty.png"; // 设置猫咪的图像URI，可以根据需要动态传入
  console.log("mycat", myCat);
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>
        {/* 显示猫咪总数量或列表 */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center">My Cats</h2>
          <div className="text-center mt-4">
            {myCat && myCat.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {myCat.map(cat => (
                  <div key={cat.id} className="border rounded p-4 shadow-lg">
                    <h3 className="font-semibold text-lg">Cat ID: {cat.id}</h3>
                    <p>Name: {cat.name}</p>
                    <p>Gender: {cat.gender}</p>
                    <img src={cat.imageURI} alt={`${cat.name} image`} className="w-full h-32 object-cover mt-2" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4">Loading your cats...</p>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                await mintCat({
                  functionName: "mintCat", // 铸造猫咪的方法
                  args: [catName, catGender, catImageURI], // 传入猫咪名称、性别和图像URI
                  // value: parseEther("0.1"), // 如果铸造需要支付ETH，设置金额；否则可删除此行
                });
                console.log("Cat minted successfully");
              } catch (e) {
                console.error("Error minting cat:", e);
              }
            }}
          >
            Withdraw Cat
          </button>
        </div>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
