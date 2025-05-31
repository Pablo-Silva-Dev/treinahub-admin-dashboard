import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { faqQuestions } from "@/data/faq";
import { FaqCollapsibleCard } from "./components/FaqCollapsibleCard";

export default function ManageFaqQuestions() {
  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 mb-12 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <ScreenTitleIcon
          screenTitle="Perguntas frequentes"
          iconName="help-circle"
        />
        <Subtitle
          content="Consulte aqui as perguntas mais frequentes em relação ao uso da plataforma."
          className="mt-4 mb-8 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
        />

        <FaqCollapsibleCard questions={faqQuestions} />
      </div>
    </main>
  );
}
