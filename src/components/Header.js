import Image from "next/image"
import {
    MenuIcon,
    SearchIcon,
    ShoppingCartIcon,
    XIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    UserCircleIcon
} from "@heroicons/react/outline"
import { signIn, signOut, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import { useState } from "react";

function Header() {
    const [session] = useSession();
    const router = useRouter();
    const items = useSelector(selectItems)
    const [sidebaropen, setSidebaropen] = useState(false);
    const handleToggle = () => {
        setSidebaropen((prevSidebaropen) => !prevSidebaropen);
        document.body.overflow = "hidden";
    };
    const handleClose = () => {
        setSidebaropen((prevSidebaropen) => !prevSidebaropen);
        document.body.overflow = "unset"
    };

    return (
        <header className="relative">
            <div className="bg-white w-80 absolute h-screen duration-100  z-50 overflow-x-hidden overflow-y-scroll " style={sidebaropen ? { "left": "0px" } : { "left": "-500px" }}>
                {/* <XIcon className="absolute h-8 text-white -right-8 top-2 cursor-pointer" onClick={handleClose}/> */}
                <div className="bg-amazon_blue-light w-full h-12 flex items-center">
                    <div className=" mx-4 flex items-center space-x-4 text-white font-bold">
                        {session ? <Image src={session.user.image} height={50} width={50} className="rounded-full" /> : <UserCircleIcon className="h-8 text-white "/>}
                        <p>Hello, {session ? session.user.name : "User"}</p>
                    </div>
                    <XIcon className="h-8 text-white ml-28 cursor-pointer" onClick={handleClose} />

                </div>

                <div className="flex flex-col space-y-4">
                    <ul className="mt-6 border-b-2 border-gray-300">
                        <p className="font-bold ml-6 text-lg">SHOP BY CATEGORIES</p>
                        {session ? <li onClick={signOut}  className="py-2 w-ful text-xm hover:bg-gray-300 px-6 cursor-pointer">
                            Sign Out
            </li> : <li onClick={signIn} className="py-2 w-ful text-xm hover:bg-gray-300 px-6 cursor-pointer">
                            Sign In
            </li>}
                        <li className="py-2 w-ful text-xm hover:bg-gray-300 px-6 cursor-pointer">
                            TOYS AND GAMES
            </li>
                        <li className="py-2 w-ful text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            VIDEO GAMES
            </li>
                        <li className="py-2 w-ful text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            AMAZON MUSIC
            </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Echo & Alexa
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>

                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Fire TV
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Kindle E-Readers & eBooks
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Audible Audiobooks
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Amazon Prime Video
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Amazon Prime Music
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                    </ul>

                    <ul className="mt-6 border-b-2 border-gray-300">
                        <p className="font-bold ml-6 text-lg">Shop By Department</p>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Mobiles, Computers
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            TV, Appliances, Electronics
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Men's Fashion
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-between items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            Women's Fashion
              <ChevronRightIcon className="h-4 text-gray-500 " />
                        </li>
                        <li className="py-2 w-ful flex justify-items-start items-center text-xm hover:bg-gray-300 px-6 capitalize cursor-pointer">
                            See all
              <ChevronDownIcon className="h-4 ml-2 text-gray-500 " />
                        </li>

                    </ul>

                </div>

            </div>

            {/* top */}
            <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
                <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
                    <Image
                        onClick={() => router.push("/")}
                        src="https://links.papareact.com/f90"
                        width={150}
                        height={40}
                        objectFit="contain"
                        className="cursor-pointer"
                    />
                </div>
                {/* search */}
                <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
                    <input className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4" type="text" />
                    <SearchIcon className="h-12 p-4" />
                </div>
                {/* right */}
                <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                    <div onClick={!session ? signIn : signOut} className="link">
                        <p className="hover:underline">
                            {session ? `Hello, ${session.user.name}` : `Sign In`}
                        </p>
                        <p className="font-extrabold md:text-sm">Accounts & list</p>
                    </div>
                    <div className="link">
                        <p>Returns</p>
                        <p className="font-extrabold md:text-sm">& Orders</p>
                    </div>
                    <div onClick={() => router.push("/checkout")} className="relative link flex items-center">
                        <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black">{items.length}</span>
                        <ShoppingCartIcon className="h-10" />
                        <p className="hidden md:inline font-extrabold md:text-sm mt-2">Basket</p>
                    </div>
                </div>
            </div>
            {/* bottom */}
            <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm">
                <p onClick={handleToggle} className="link flex items-center">
                    <MenuIcon className="h-6 mr-1" />
                    All
                </p>
                <p className="link ">Prime Video</p>
                <p className="link ">Amazon Business</p>
                <p className="link ">Today's Deals</p>
                <p className="link hidden lg:inline-flex">Electronics</p>
                <p className="link hidden lg:inline-flex">Food & Grocery</p>
                <p className="link hidden lg:inline-flex">Prime</p>
                <p className="link hidden lg:inline-flex">Buy Again</p>
                <p className="link hidden lg:inline-flex">Shopper ToolKit</p>
                <p className="link hidden lg:inline-flex">Health & Personal Care</p>
            </div>
        </header>
    )
}

export default Header
