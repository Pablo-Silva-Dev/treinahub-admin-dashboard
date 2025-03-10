import { collapseLongString } from "@/utils/formats";

interface CourseProgressCardProps {
  totalCourseClasses: number;
  totalWatchedClasses: number;
  course: string;
}

export function CourseProgressCard({
  course,
  totalCourseClasses,
  totalWatchedClasses,
}: CourseProgressCardProps) {
  const watchedClassesPercentage = Number(
    (totalWatchedClasses / totalCourseClasses) * 100
  );

  const totalWatchedClassesPercentage =
    watchedClassesPercentage === 0 || isNaN(watchedClassesPercentage)
      ? 0
      : Math.floor(watchedClassesPercentage).toFixed(0);

  return (
    <div className="w-full max-w-[1200px] flex flex-col md:flex-row p-3 md:p-4 bg-white dark:bg-slate-700  rounded-lg items-center mb-2">
      <div className="flex flex-row w-full items-center justify-start">
        <span className="text-gray-700 dark:text-gray-100 text-xs font-bold mr-2 md:min-w-[160px] ">
          {collapseLongString(course, 80)}
        </span>
        <div className="w-full md:h-[6px] h-[4px] bg-gray-300 mr-2 rounded-md">
          <div
            className="md:h-[6px] h-[4px] bg-secondary rounded-md"
            style={{ width: `${totalWatchedClassesPercentage}%` }}
          />
        </div>
      </div>
      <div className="flex flex-row w-full items-center md:justify-end justify-start mt-2">
        <span className="text-gray-700 dark:text-gray-100 text-xs mr-4">
          {totalWatchedClassesPercentage}% concluído
        </span>
        <span className="text-gray-700 dark:text-gray-100 text-xs font-bold">
          {" "}
          {totalWatchedClasses} de {totalCourseClasses} aulas assistidas
        </span>
      </div>
    </div>
  );
}
