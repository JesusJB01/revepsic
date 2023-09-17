"use client";

import React, { useEffect, useState } from "react";
import {useTheme} from "next-themes";
import {Switch} from "@nextui-org/react";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";

export default function SwitchDarkMode() {

  const {theme, setTheme} = useTheme();
 
 
  return (
    <Switch
    onClick={() => setTheme(theme === "dark" ? "light" : "dark" )}
      size="lg"
      color="warning"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    />
    
  );
}



