import Image from "next/image";
import React from "react";

export default function Ponencia() {
  return (
    <div className="mx-auto container py-10 flex flex-col items-center space-y-10 text-gray-800 font-serif text-justify dark:text-white">
      <h2 className="text-3xl font-bold mt-10 text-center">
        La Red Venezolana para el Avance de la Psicología Científica estará{" "}
        <br />
        Presente en el IV Congreso Venezolano de Psicología
      </h2>
      <div className="w-2/3 flex flex-col items-center py-10">
        <h3 className="text-lg mb-10">
          <strong>Caracas, 21 de noviembre de 2023</strong> - La{" "}
          <strong>
            Red Venezolana para el Avance de la Psicología Científica (REVEPSIC)
          </strong>{" "}
          presentará una mesa de trabajo sobre &quot;Psicología Basada en
          Evidencia: Promoviendo la Práctica Psicológica Fundamentada&quot; en
          el IV Congreso Venezolano de Psicología: La Salud Mental, un camino
          para el buen vivir. Dicha actividad se llevará a cabo el próximo 23 de
          noviembre a las 2:30 PM en el aula 4 de la escuela de Psicología de la{" "}
          <strong>Universidad Central de Venezuela (UCV)</strong>. El congreso
          contará con la participación de tres de sus miembros como ponentes:
        </h3>

        <ul className="list-disc space-y-9 pl-6">
          <li className="text-xl">
            <span className="font-bold">Licdo. Jhonnathan Salvarán:</span>{" "}
            Psicólogo de la UCAB, Maestrante de Psicología Clínica y Comunitaria
            de la UCAB. Miembro profesional y representante del grupo de
            afiliación para Venezuela de la Association for Contextual
            Behavioral Science (ACBS). Miembro de la{" "}
            <strong>
              Red Venezolana para el Avance de la Psicología Científica
            </strong>
            . Con su ponencia se titula “Una mirada contextual funcional a las
            prácticas basadas en evidencia: historia y evolución”
          </li>

          <li className="text-xl">
            <span className="font-bold">Licdo. Luis Madera:</span> Licdo.
            Psicólogo Clínico de la UBA. Miembro de la{" "}
            <strong>
              Red Venezolana para el Avance de la Psicología Científica
            </strong>
            . Con su ponencia se titula “Metodología y Criterios de la
            Psicología Basada en Evidencia”
          </li>

          <li className="text-xl">
            <span className="font-bold">Licdo. Alejandro Becerra:</span>{" "}
            Psicólogo de la UNY, Esp. En Gestión en Salud Pública del IAE,
            Doctorando del Doctorado en Ciencias Sociales de la UNELLEZ. Miembro
            de la <strong>Red Global de Prácticas Clínicas de la OMS</strong>,
            presidente de la{" "}
            <strong>
              Red Venezolana para el Avance de la Psicología Científica
            </strong>
            , Miembro de la Sociedad Interamericana de Psicología. Con su
            ponencia se titula “Decisiones clínicas fundamentadas en evidencia
            científica”
          </li>
        </ul>
        <p className="text-lg mt-9">
          La participación de <strong>REVEPSIC</strong> en el IV Congreso
          Nacional de Psicología no solo representa una oportunidad valiosa para
          que los profesionales de la psicología en
          <strong>&nbsp;Venezuela</strong> se familiaricen con los principios y
          aplicaciones de la psicología basada en evidencia, sino que también
          evidencia nuestro firme compromiso con el impulso y desarrollo
          continuo de la psicología científica en el país. En este sentido, nos
          esforzamos incansablemente para promover la investigación en
          psicología, fortalecer los pilares educativos que sustentan nuestra
          disciplina y consolidar la práctica psicológica basada en evidencia
          como un estándar fundamental en el ejercicio profesional. En{" "}
          <strong>REVEPSIC</strong> se erige como un vehículo activo de cambio y
          progreso en el panorama psicológico venezolano, trabajando de la mano
          con la comunidad académica y profesional para construir un futuro
          sólido y fundamentado en los principios científicos de la psicología.
        </p>
      </div>
    </div>
  );
}
