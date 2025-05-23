import { ITEMS_PER_PAGE_OPTIONS } from "@/appConstants/index";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";
import { Title } from "@/components/typography/Title";
import { ICertificateDTO } from "@/repositories/dtos/CertificateDTO";
import { collapseLongString } from "@/utils/formats";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineFileDownload,
  MdZoomIn,
} from "react-icons/md";

const TABLE_HEAD = [
  { label: "Treinamento", propRef: "training_name" },
  { label: "Usuário", propRef: "user_name" },
  { label: "Ações", propRef: "" },
];

interface CertificatesTableProps {
  certificates: ICertificateDTO[];
  onDownloadCertificate: (certificateId: string) => void;
  onSeeCertificate: (certificateId: string) => void;
  onSelectCertificate: (certificateId: string) => void;
}

export function CertificatesTable({
  certificates,
  onDownloadCertificate,
  onSeeCertificate,
  onSelectCertificate,
}: CertificatesTableProps) {
  const [page, setPage] = useState(1);
  const [pagesListIndex, setPagesListIndex] = useState(0);
  const [sortedTrainings, setSortedTrainings] = useState<ICertificateDTO[]>([]);
  const [tableData, setTableData] = useState<ICertificateDTO[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(
    ITEMS_PER_PAGE_OPTIONS[0].value
  );

  const pages = Array.from(
    { length: Math.ceil(sortedTrainings.length / itemsPerPage) },
    (_, idx) => idx + 1
  );

  const MAX_PAGES_TO_SHOW = 5;
  const MAX_STRING_LENGTH = 40;

  const canGoToPreviousSet = pagesListIndex > 0;
  const canGoToNextSet =
    pagesListIndex < Math.ceil(pages.length / MAX_PAGES_TO_SHOW) - 1;

  const currentTableData = useCallback(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setTableData(sortedTrainings.slice(startIndex, endIndex) as never);
  }, [itemsPerPage, page, sortedTrainings]);

  useEffect(() => {
    setSortedTrainings(certificates);
  }, [certificates]);

  useEffect(() => {
    currentTableData();
  }, [currentTableData]);

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  const handleSeeCertificate = (certificateId: string) => {
    onSelectCertificate(certificateId);
    onSeeCertificate(certificateId);
  };

  const handleDownloadCertificate = (certificateId: string) => {
    onSelectCertificate(certificateId);
    onDownloadCertificate(certificateId);
  };

  return (
    <Card className="w-full flex flex-col lg:justify-between mx-auto bg-white dark:bg-slate-900">
      <CardBody className="overflow-auto p-0 rounded-lg w-full">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200 dark:bg-slate-700">
              {TABLE_HEAD.map((head) => (
                <th
                  key={head.label}
                  className="bg-gray-200 dark:bg-slate-700 px-2 py-2 lg:p-4"
                >
                  <Title
                    content={head.label}
                    className={
                      head.label === "Ações"
                        ? "text-[11px] md:text[12px] lg:text-sm text-center text-gray-900 dark:text-gray-100"
                        : "text-[11px] md:text[12px] lg:text-sm text-gray-900 dark:text-gray-100"
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="w-[90%] lg:w-full">
            {tableData.map(({ id, training, user }, index) => {
              if (training) {
                const isLast = index === tableData.length - 1;
                const classes = isLast
                  ? "py-0"
                  : "py-0 border-b border-gray-200 dark:border-gray-800";
                return (
                  <tr
                    key={user!.name + index}
                    className="even:bg-gray-50 dark:even:bg-slate-800"
                  >
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Subtitle
                          content={training.name}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Text
                        content={collapseLongString(
                          user!.name,
                          MAX_STRING_LENGTH
                        )}
                        className="block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] md:text[12px] lg:text-sm ml-2 lg:ml-4 text-gray-700 dark:text-gray-300"
                      />
                    </td>
                    <td className={classes}>
                      <Tooltip
                        content="Baixar certicado"
                        className="hidden lg:flex"
                      >
                        <IconButton
                          variant="text"
                          onClick={() => handleDownloadCertificate(id)}
                          className="p-0 bg-transparent hover:bg-transparent hover:p-0 text-end"
                        >
                          <MdOutlineFileDownload className="sm:h-5 sm:w-5 h-3 w-3 p-0 text-gray-700 dark:text-gray-300" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip
                        content="Ver certicado"
                        className="hidden lg:flex"
                      >
                        <IconButton
                          variant="text"
                          onClick={() => handleSeeCertificate(id)}
                          className="p-0 bg-transparent hover:bg-transparent hover:p-0 ml-[-48px]"
                        >
                          <MdZoomIn className="sm:h-5 sm:w-5 h-3 w-3 p-0 text-gray-700 dark:text-gray-300" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            })}
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
            options={ITEMS_PER_PAGE_OPTIONS}
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
                  .map((CoursePage) => (
                    <IconButton
                      key={CoursePage}
                      variant={page === CoursePage ? "outlined" : "text"}
                      size="sm"
                      onClick={() => setPage(CoursePage)}
                      className="text-[11px] lg:text-sm w-6 h-6 lg:w-8 lg:h-8 mr-2 mt-2 text-gray-700 dark:text-gray-300 shadow-none dark:border-1 dark:border-gray-200"
                    >
                      {CoursePage}
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
              pages.map((CoursePage) => (
                <IconButton
                  key={CoursePage}
                  variant={page === CoursePage ? "outlined" : "text"}
                  size="sm"
                  onClick={() => setPage(CoursePage)}
                  className="text-[11px] lg:text-sm w-6 h-6 lg:w-8 lg:h-8 mr-2 mt-2 text-gray-700 dark:text-gray-300 shadow-none dark:border-1 dark:border-gray-200"
                >
                  {CoursePage}
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
