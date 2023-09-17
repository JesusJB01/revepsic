"use client"
import React from 'react'
import {Card, CardHeader, CardBody, Divider} from "@nextui-org/react"
import { FaFlask, FaBook, FaGraduationCap, FaHandsHelping, FaUserShield, FaGavel } from 'react-icons/fa';

const caracteristicas = [
  {
    titulo: "Rigor científico",
    descripcion: "Nos enorgullece promover la investigación rigurosa en psicología, siempre basada en la evidencia y respaldada por la metodología científica. A través de la revisión por pares, aseguramos la calidad de las investigaciones que compartimos.",
    icono: <FaFlask size="2rem" style={{ color: "violet" }} />
  },
  {
    titulo: "Difusión del conocimiento",
    descripcion: "Facilitamos la difusión de conocimientos y descubrimientos en psicología mediante la publicación de revistas científicas, organización de conferencias y simposios. Aquí es donde los profesionales y académicos comparten sus investigaciones y avances con la comunidad.",
    icono: <FaBook size="2rem" color="violet"/>
  },
  {
    titulo: "Formación y educación",
    descripcion: "Ofrecemos oportunidades de formación y educación continua para profesionales de la psicología, asegurando que estén siempre al día con los últimos desarrollos en el campo.",
    icono: <FaGraduationCap size="2rem" color="violet" />
  },
  {
    titulo: "Fomento de la colaboración",
    descripcion: "Promovemos la colaboración entre profesionales de la psicología, tanto a nivel nacional como internacional. Nuestras conferencias, talleres y grupos de trabajo son lugares ideales para establecer conexiones y colaborar en investigaciones.",
    icono: <FaHandsHelping size="2rem" color="violet" />
  },
  {
    titulo: "Ética y estándares profesionales",
    descripcion: "Establecemos y promovemos rigurosos estándares éticos para los psicólogos y psicólogas, garantizando que la integridad y la responsabilidad sean fundamentales en la práctica profesional y la investigación.",
    icono: <FaUserShield size="2rem" color="violet" />
  },
  {
    titulo: "Representación y defensa",
    descripcion: "Nos dedicamos a representar los intereses de la comunidad de psicólogos ante instituciones gubernamentales, organizaciones profesionales y otros actores relevantes. Defendemos los derechos y el reconocimiento de la psicología como una disciplina científica vital.",
    icono: <FaGavel size="2rem" color="violet" />
  }
];

export default function Description() {
    return (
        <div className='bg-gray-100 flex  justify-center w-full px-10 py-20 dark:bg-slate-500'>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {caracteristicas.map((caracteristica, index) => (
              <Card className="max-w-[400px]" key={index}>
                <CardHeader className="flex gap-3">
                  {caracteristica.icono}
                  <div className="flex flex-col">
                    <p className="text-base text-black dark:text-white font-medium ">{caracteristica.titulo}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className='text-justify text-gray-400 text-sm tracking-tighter '>{caracteristica.descripcion}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      );
}
