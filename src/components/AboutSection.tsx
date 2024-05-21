"use client";
import React from 'react'

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import Lokanath from "@/data/ImageData/codingWallpaper.jpg";
function AboutSection() {

    return (
        <>
            <div className="flex flex-col overflow-hidden">
                <ContainerScroll
                    titleComponent={
                        <>

                        </>
                    }
                >
                    <Image
                        src={Lokanath}
                        alt="hero"
                        height={720}
                        width={1400}
                        className="mx-auto rounded-2xl object-cover h-full object-left-top"
                        draggable={false}
                    />
                </ContainerScroll>
            </div>

        </>
    )
}

export default AboutSection
