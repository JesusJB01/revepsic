import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div>
      <header>
        <div className="relative mx-auto h-96 w-full max-w-screen-xl md:my-4">
          <div className="absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-gray-700 xl:rounded-lg">
            <Image
              width={1000}
              height={1000}
              src="/nosotros2.svg"
              alt="Picture of the author"
              className="absolute left-0 top-0 z-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 z-20 p-4">
              <h2 className="text-xl font-bold italic text-purple-300">
                Sobre Revepsic
              </h2>
            </div>
          </div>
        </div>
      </header>

      <div className="py-10">
        <section className="container mx-auto flex justify-center px-10">
          <p className="text-justify font-serif">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget
            lorem dolor sed viverra ipsum nunc aliquet bibendum. Pulvinar
            pellentesque habitant morbi tristique senectus et. Pellentesque eu
            tincidunt tortor aliquam. Enim nunc faucibus a pellentesque sit amet
            porttitor eget dolor. Orci porta non pulvinar neque laoreet
            suspendisse interdum. In aliquam sem fringilla ut morbi tincidunt
            augue. Adipiscing elit pellentesque habitant morbi tristique
            senectus et netus et. Massa tempor nec feugiat nisl pretium.
            Elementum integer enim neque volutpat. Nec sagittis aliquam
            malesuada bibendum. Ultricies integer quis auctor elit sed. Aliquet
            sagittis id consectetur purus ut faucibus pulvinar elementum
            integer. Vel fringilla est ullamcorper eget nulla facilisi. Laoreet
            suspendisse interdum consectetur libero id. Nisl suscipit adipiscing
            bibendum est ultricies integer quis auctor. A condimentum vitae
            sapien pellentesque habitant. Donec ultrices tincidunt arcu non
            sodales neque sodales ut etiam. Elit duis tristique sollicitudin
            nibh sit amet commodo nulla. Blandit volutpat maecenas volutpat
            blandit aliquam etiam erat velit. Leo in vitae turpis massa sed
            elementum tempus egestas sed. Quis imperdiet massa tincidunt nunc
            pulvinar sapien et ligula. Sem nulla pharetra diam sit amet nisl
            suscipit. Amet nisl purus in mollis nunc sed id semper. In
            pellentesque massa placerat duis. Mattis nunc sed blandit libero.
            Scelerisque in dictum non consectetur a erat nam at lectus.
            Adipiscing elit duis tristique sollicitudin nibh sit amet. Netus et
            malesuada fames ac turpis egestas maecenas pharetra convallis.
            Cursus risus at ultrices mi tempus imperdiet nulla malesuada
            pellentesque. Lectus vestibulum mattis ullamcorper velit sed
            ullamcorper morbi. Tortor posuere ac ut consequat semper viverra
            nam. Et ligula ullamcorper malesuada proin libero nunc consequat
            interdum varius. Gravida arcu ac tortor dignissim convallis. Cursus
            sit amet dictum sit amet justo. Neque laoreet suspendisse interdum
            consectetur libero id faucibus. Amet aliquam id diam maecenas
            ultricies mi eget mauris pharetra. Nec tincidunt praesent semper
            feugiat nibh sed pulvinar. Et ultrices neque ornare aenean euismod
            elementum nisi quis. Semper eget duis at tellus at urna condimentum
            mattis pellentesque. Sem viverra aliquet eget sit amet tellus.
            Convallis aenean et tortor at risus viverra adipiscing. Vitae purus
            faucibus ornare suspendisse sed nisi lacus sed viverra. Nunc
            scelerisque viverra mauris in aliquam sem fringilla ut morbi. Orci
            nulla pellentesque dignissim enim sit amet venenatis. Et molestie ac
            feugiat sed lectus vestibulum mattis ullamcorper. Egestas erat
            imperdiet sed euismod nisi. Nulla at volutpat diam ut venenatis.
            Pretium vulputate sapien nec sagittis aliquam malesuada. Id donec
            ultrices tincidunt arcu non sodales neque sodales ut. Ultricies mi
            quis hendrerit dolor magna eget est. Et ligula ullamcorper malesuada
            proin libero nunc. Mauris nunc congue nisi vitae. Mollis nunc sed id
            semper risus. Odio euismod lacinia at quis risus. Amet mauris
            commodo quis imperdiet massa. A arcu cursus vitae congue mauris
            rhoncus aenean vel elit. Facilisis mauris sit amet massa vitae.
            Faucibus purus in massa tempor nec feugiat. Ultrices sagittis orci a
            scelerisque purus semper. Quisque egestas diam in arcu cursus. Diam
            volutpat commodo sed egestas egestas. Ut lectus arcu bibendum at
            varius. Morbi tincidunt augue interdum velit euismod in. Adipiscing
            vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Non
            pulvinar neque laoreet suspendisse interdum consectetur libero id.
            Iaculis at erat pellentesque adipiscing commodo elit at imperdiet
            dui. Faucibus vitae aliquet nec ullamcorper sit amet risus. Ornare
            lectus sit amet est placerat in egestas erat imperdiet. Massa tempor
            nec feugiat nisl. Sem et tortor consequat id. Commodo sed egestas
            egestas fringilla phasellus. Lacus laoreet non curabitur gravida
            arcu ac tortor dignissim convallis. Nunc lobortis mattis aliquam
            faucibus purus in. Tincidunt eget nullam non nisi est sit amet
            facilisis magna. Ultricies lacus sed turpis tincidunt.
          </p>
        </section>
      </div>
    </div>
  );
}
