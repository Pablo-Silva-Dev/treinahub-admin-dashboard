import { ITEMS_PER_PAGE_OPTIONS_SHORT_TABLE } from "@/appConstants/index";
import video_thumbnail_placeholder from "@/assets/video_thumbnail_placeholder.svg";
import { SortButton } from "@/components/buttons/SortButton";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";
import { Title } from "@/components/typography/Title";
import {
  IUpdateVideoClassDTO,
  IVideoClassDTO,
} from "@/repositories/dtos/VideoClassDTO";
import { convertGBsToMbs } from "@/utils/convertSize";
import { secondsToFullTimeString } from "@/utils/convertTime";
import { collapseLongString } from "@/utils/formats";
import { sortItems } from "@/utils/sorting";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import {
  MdEdit,
  MdInfo,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface VideoClassesTableProps {
  classes: IVideoClassDTO[];
  onUpdateVideoClass: (data: IUpdateVideoClassDTO) => void;
  onDeleteVideoClass: (videoClassId: string) => void;
  onSelectVideoClass: (videoClassId: string) => void;
  onWatchVideoClass: (videoClassId: string) => void;
  videoClass: IUpdateVideoClassDTO;
  showStorage: boolean;
}

export function VideoClassesTable({
  classes,
  videoClass,
  onDeleteVideoClass,
  onUpdateVideoClass,
  onSelectVideoClass,
  onWatchVideoClass,
  showStorage,
}: VideoClassesTableProps) {
  const TABLE_HEAD = showStorage
    ? [
        { label: "", propRef: "" },
        { label: "Aula", propRef: "name" },
        { label: "Descrição", propRef: "description" },
        { label: "Treinamento", propRef: "name" },
        { label: "Duração", propRef: "duration" },
        { label: "Tamanho", propRef: "storage_size" },
        { label: "Status", propRef: "status" },
        { label: "Ações", propRef: "" },
      ]
    : [
        { label: "", propRef: "" },
        { label: "Aula", propRef: "name" },
        { label: "Descrição", propRef: "description" },
        { label: "Treinamento", propRef: "name" },
        { label: "Duração", propRef: "duration" },
        { label: "Status", propRef: "status" },
        { label: "Ações", propRef: "" },
      ];

  const [page, setPage] = useState(1);
  const [pagesListIndex, setPagesListIndex] = useState(0);
  const [sortedVideoClasses, setSortedVideoClasses] = useState<
    IVideoClassDTO[]
  >([]);
  const [tableData, setTableData] = useState<IVideoClassDTO[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(
    ITEMS_PER_PAGE_OPTIONS_SHORT_TABLE[0].value
  );

  const pages = Array.from(
    { length: Math.ceil(sortedVideoClasses.length / itemsPerPage) },
    (_, idx) => idx + 1
  );

  const MAX_PAGES_TO_SHOW = 5;
  const MAX_STRING_LENGTH = 80;

  const canGoToPreviousSet = pagesListIndex > 0;
  const canGoToNextSet =
    pagesListIndex < Math.ceil(pages.length / MAX_PAGES_TO_SHOW) - 1;

  const currentTableData = useCallback(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setTableData(sortedVideoClasses.slice(startIndex, endIndex) as never);
  }, [itemsPerPage, page, sortedVideoClasses]);

  useEffect(() => {
    setSortedVideoClasses(classes);
  }, [classes]);

  useEffect(() => {
    currentTableData();
  }, [currentTableData]);

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  const handleSort = (propRef: string, sortType: "asc" | "desc") => {
    const sortedData = sortItems([...classes], propRef, sortType);
    setSortedVideoClasses(sortedData);
    setPage(1);
  };

  const handleDeleteVideoClass = (videoClassId: string) => {
    onSelectVideoClass(videoClassId);
    onDeleteVideoClass(videoClassId);
  };

  const handleUpdateVideoClass = (videoClassId: string) => {
    onSelectVideoClass(videoClassId);
    onUpdateVideoClass(videoClass as IUpdateVideoClassDTO);
  };

  const handleWatchVideoClass = (videoClassId: string) => {
    onSelectVideoClass(videoClassId);
    onWatchVideoClass(videoClassId);
  };

  return (
    <Card className="w-full flex flex-col lg:justify-between mx-auto bg-white dark:bg-slate-900">
      <CardBody className="overflow-auto p-0 rounded-lg w-full">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200 dark:bg-slate-700">
              {TABLE_HEAD.map((head, i) => (
                <th
                  key={head.label + i}
                  className="bg-gray-200 dark:bg-slate-700 px-2 py-2 lg:p-4"
                >
                  <Title
                    content={head.label}
                    className="text-[11px] md:text[12px] lg:text-sm text-gray-900 dark:text-gray-100"
                  />
                </th>
              ))}
            </tr>
            <tr>
              {TABLE_HEAD.map((head, i) => (
                <th
                  key={head.label + i}
                  className="bg-white dark:bg-slate-900 py-1 px-4"
                >
                  {head.propRef && head.propRef !== "status" && (
                    <div className="flex flex-row ml-[-8px]">
                      <SortButton
                        onClick={() => handleSort(head.propRef, "asc")}
                        sortType="asc"
                      />
                      <SortButton
                        onClick={() => handleSort(head.propRef, "desc")}
                        sortType="desc"
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="w-[90%] lg:w-full">
            {tableData && tableData.length > 0 ? (
              tableData.map(
                (
                  {
                    id,
                    name,
                    training,
                    description,
                    duration,
                    status,
                    storage_size,
                  },
                  index
                ) => {
                  const isLast = index === tableData.length - 1;
                  const classes = isLast
                    ? "py-0"
                    : "py-0 border-b border-gray-200 dark:border-gray-800";
                  return (
                    <tr
                      key={name + index}
                      className="even:bg-gray-50 dark:even:bg-slate-800"
                    >
                      <td className={classes}>
                        <button
                          onClick={() => handleWatchVideoClass(id)}
                          className="flex items-center m-4 mr-0 md:mr-[-5%] xl:mr-[-12px] w-[80px] relative"
                        >
                          <img
                            src={video_thumbnail_placeholder}
                            alt="videoaula"
                            width="80%"
                            className="rounded-sm"
                          />
                        </button>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Subtitle
                            content={collapseLongString(
                              name,
                              MAX_STRING_LENGTH
                            )}
                            className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300 mr-4"
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Text
                          content={collapseLongString(
                            description,
                            MAX_STRING_LENGTH
                          )}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300 mr-4"
                        />
                      </td>
                      <td className={classes}>
                        <Text
                          content={collapseLongString(
                            training!.name,
                            MAX_STRING_LENGTH
                          )}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300 mr-4"
                        />
                      </td>
                      <td className={classes}>
                        <Text
                          content={secondsToFullTimeString(duration)}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300 mr-4"
                        />
                      </td>
                      {showStorage && (
                        <td className={classes}>
                          <Text
                            content={convertGBsToMbs(storage_size) + " MB"}
                            className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300 mr-4"
                          />
                        </td>
                      )}
                      <td className={classes}>
                        <Text
                          content={
                            status === "CONVERTING"
                              ? "Processando..."
                              : status === "DRAFT"
                                ? "Processando..."
                                : status === "CONVERTED"
                                  ? "Disponível"
                                  : "Falha no processamento"
                          }
                          className={
                            status === "CONVERTED"
                              ? "block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-green-400 mr-1"
                              : status === "CONVERTING"
                                ? "block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-orange-400 mr-1"
                                : status === "DRAFT"
                                  ? "block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-orange-400 mr-1"
                                  : "block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-red-400 mr-1"
                          }
                        />
                        {status === "CONVERTING" && (
                          <Tooltip content="O processo de conversão da videoaula está em andamento. O status da videoaula será atualizado assim que a conversão for concluída.">
                            <button
                              className="hover:bg-transparent active:bg-transparent mt-1"
                            >
                              <MdInfo className="lg:h-5 lg:w-5 h-3 w-3 text-slate-500 dark:text-white ml-8 lg:ml-12" />
                            </button>
                          </Tooltip>
                        )}
                      </td>
                      <td className={classes}>
                        <Tooltip
                          content="Editar dados da videoaula"
                          className="hidden lg:flex"
                        >
                          <IconButton
                            variant="text"
                            onClick={() => handleUpdateVideoClass(id)}
                            className="p-0 bg-transparent hover:bg-transparent hover:p-0 mr-8 lg:mr-4"
                          >
                            <MdEdit className="lg:h-5 lg:w-5 h-3 w-3 p-0 text-gray-700 dark:text-gray-300" />
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <Tooltip
                          content="Remover aula"
                          className="hidden lg:flex"
                        >
                          <IconButton
                            variant="text"
                            className="p-0 bg-transparent hover:bg-transparent hover:p-0 lg:ml-[-40px] ml-[-46px]"
                            onClick={() => handleDeleteVideoClass(id)}
                          >
                            <IoMdTrash className="lg:h-5 lg:w-5 h-3 w-3 text-red-500 lg:mr-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                  <span className="text-[11px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300">
                    Sem dados para exibir
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-blue-gray-50 p-4 w-full">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="lg:w-[96px] text-[11px] lg:text-sm mx-auto normal-case text-gray-700 dark:text-gray-300 shadow-none dark:border-1 dark:border-gray-200"
        >
          Anterior
        </Button>
        <div className="flex md:flex-row flex-col md:w-full w-[90%] mx-auto items-center justify-center">
          <SelectInput
            label="Items por página"
            options={ITEMS_PER_PAGE_OPTIONS_SHORT_TABLE}
            className="mx-auto w-[96px]"
            containerClassName="md:mr-5 my-4 lg:my-0"
            labelClassName="text-[10px] lg:text-sm text-gray-700 dark:text-gray-100"
            isSearchable={false}
            onSelectOption={(val) => setItemsPerPage(val.value as never)}
          />
          <div className="flex items-center gap-2 mb-4 lg:mb-0">
            {pages.length > MAX_PAGES_TO_SHOW ? (
              <div className="flex flex-row">
                {canGoToPreviousSet && (
                  <IconButton
                    size="md"
                    onClick={() => setPagesListIndex(pagesListIndex - 1)}
                    variant="text"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <MdKeyboardDoubleArrowLeft className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                  </IconButton>
                )}
                {pages
                  .slice(
                    pagesListIndex * MAX_PAGES_TO_SHOW,
                    MAX_PAGES_TO_SHOW * (pagesListIndex + 1)
                  )
                  .map((VideoClassPage) => (
                    <IconButton
                      key={VideoClassPage}
                      variant={page === VideoClassPage ? "outlined" : "text"}
                      size="sm"
                      onClick={() => setPage(VideoClassPage)}
                      className="text-[11px] lg:text-sm w-6 h-6 lg:w-8 lg:h-8 mr-2 mt-2 text-gray-700 dark:text-gray-300 shadow-none dark:border-1 dark:border-gray-200"
                    >
                      {VideoClassPage}
                    </IconButton>
                  ))}
                {canGoToNextSet && (
                  <IconButton
                    size="md"
                    onClick={() => setPagesListIndex(pagesListIndex + 1)}
                    variant="text"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <MdKeyboardDoubleArrowRight className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                  </IconButton>
                )}
              </div>
            ) : (
              pages.map((VideoClassPage) => (
                <IconButton
                  key={VideoClassPage}
                  variant={page === VideoClassPage ? "outlined" : "text"}
                  size="sm"
                  onClick={() => setPage(VideoClassPage)}
                  className="text-[11px] lg:text-sm w-6 h-6 lg:w-8 lg:h-8 mr-2 mt-2 text-gray-700 dark:text-gray-300 shadow-none dark:border-1 dark:border-gray-200"
                >
                  {VideoClassPage}
                </IconButton>
              ))
            )}
          </div>
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === pages[pages.length - 1]}
          className="lg:w-[96px] text-[11px] lg:text-sm mx-auto normal-case text-gray-700 dark:text-gray-300 shadow-none dark:border-1 dark:border-gray-200"
        >
          Próximo
        </Button>
      </CardFooter>
    </Card>
  );
}
