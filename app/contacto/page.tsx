"use client";
import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";

import NextImage from "next/image";
import Link from "next/link";

export default function Page() {
  const socialLinks = [
    // {
    //   name: "Gmail",
    //   icon: <FaEnvelope />,
    //   link: "", // Enlace ficticio a Gmail
    // },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      link: "https://www.facebook.com/profile.php?id=100063495787504", // Enlace ficticio a Facebook
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "https://www.instagram.com/revepsic/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==", // Enlace ficticio a Instagram
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      link: "https://twitter.com/REVEPSIC", // Enlace ficticio a Telegram
    },
  ];

  return (
    <div className="py-10">
      <header>
        <div className="relative mx-auto h-96 w-full max-w-screen-xl md:my-4">
          <div className="absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-gray-700 xl:rounded-lg">
            <NextImage
              width={1000}
              height={1000}
              src="/contact.svg"
              alt="Picture of the author"
              className="absolute left-0 top-0 z-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col container mx-auto md:flex-row justify-center md:gap-x-10 items-center pt-10">
        <div className="hidden md:flex">
          <NextImage
            width={500}
            height={500}
            src="/contact3.svg"
            alt="Picture of the author"
            className=""
          />
        </div>
        <div className="flex flex-col pt-10 justify-center  md:pt-0 items-start md:ml-10">
          <p className="text-justify pb-5 text-gray-600 dark:text-white font-bold ">Estaremos felices de contactarnos contigo.</p>
          {socialLinks.map((social, index) => (
            <div
              key={index}
              className="flex gap-5 pt-2 items-center text-center text-white mb-3 "
            >
              <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-md bg-purple-600 p-2 md:p-4 text-white shadow-md">
                {social.icon}
              </div>
              <div >
                <Link href={social.link}  className=" text-xs md:text-sm text-black hover:text-gray-300   dark:text-white dark:hover:text-gray-300 font-semibold mb-1">
                  {social.name}
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


