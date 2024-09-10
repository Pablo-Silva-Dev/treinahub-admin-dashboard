import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { PlusButton } from "@/components/buttons/PlusButton";
import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { ContactsSupportRepository } from "@/repositories/contactsSupportRepository";
import { IContactSupportDTO } from "@/repositories/dtos/ContactSupportDTO";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { formatPhoneNumber } from "@/utils/formats";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EditSupportContactModal } from "./components/EditSupportContact";
import { ContactSupportCard } from "./components/SupportContactCard";

export function ManageSupportContact() {
  const [editContactSupportModal, setEditModalSupportContact] = useState(false);
  const [deleteContactSupportModal, setDeleteModalSupportContact] =
    useState(false);
  const [contactsSupport, setContactsSupport] = useState<IContactSupportDTO[]>(
    []
  );
  const [selectedContactSupport, setSelectedContactSupport] =
    useState<IContactSupportDTO | null>(null);

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const handleToggleEditSupportContactModal = useCallback(
    (contactSupport?: IContactSupportDTO) => {
      setEditModalSupportContact(!editContactSupportModal);
      if (contactSupport) {
        setSelectedContactSupport(contactSupport);
      }
    },
    [editContactSupportModal]
  );

  const handleToggleDeleteSupportContactModal = useCallback(
    (contactSupport?: IContactSupportDTO) => {
      setDeleteModalSupportContact(!deleteContactSupportModal);
      if (contactSupport) {
        setSelectedContactSupport(contactSupport);
      }
    },
    [deleteContactSupportModal]
  );

  const contactsSupportRepository = useMemo(() => {
    return new ContactsSupportRepository();
  }, []);

  const getContactsSupport = useCallback(async () => {
    try {
      setIsLoading(true);
      const contactSupports = await contactsSupportRepository.listContacts();
      setContactsSupport(contactSupports);
      return contactSupports;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [contactsSupportRepository, setIsLoading]);

  useEffect(() => {
    getContactsSupport();
  }, [getContactsSupport]);

  const { error, isLoading: loading } = useQuery({
    queryKey: ["contacts-support"],
    queryFn: getContactsSupport,
  });

  const handleUpdateContactSupport = useCallback(
    async (data: IContactSupportDTO) => {
      try {
        setIsLoading(true);
        await contactsSupportRepository.updateContactSupport({
          ...data,
          contact_number: formatPhoneNumber(data.contact_number),
        });
        showAlertSuccess("Contato atualizado com sucesso!");
        handleToggleEditSupportContactModal();
        queryClient.invalidateQueries([
          "contacts-support",
        ] as InvalidateQueryFilters);
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          if (error.STATUS === 409) {
            showAlertError("Já existe um contato para o número cadastrado.");
          }
        } else {
          showAlertError("Houve um erro ao atualizar contato.");
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      contactsSupportRepository,
      handleToggleEditSupportContactModal,
      queryClient,
      setIsLoading,
    ]
  );

  const handleDeleteContactSupport = useCallback(
    async (contact: IContactSupportDTO) => {
      try {
        setIsLoading(true);
        await contactsSupportRepository.deleteContactSupport(contact.id);
        handleToggleDeleteSupportContactModal();
        showAlertSuccess("Contato deletado com sucesso!");
        queryClient.invalidateQueries([
          "contacts-support",
        ] as InvalidateQueryFilters);
      } catch (error) {
        console.log("Houve um erro ao tentar deletar contato.");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      contactsSupportRepository,
      handleToggleDeleteSupportContactModal,
      queryClient,
      setIsLoading,
    ]
  );

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="mb-2 flex flex-row w-[full] justify-between items-center">
        <div className="mt-3 w-full">
          <ScreenTitleIcon
            screenTitle="Gerenciar contato de suporte."
            iconName="help-circle"
          />
          <Subtitle
            content="Consulte e gerencie seus contatos de suporte."
            className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
          />
        </div>
        <div className="mr-4 md:w-[220px]">
          <Link to="/dashboard/cadastrar-contato-de-suporte">
            <PlusButton title="Cadastrar contato" />
          </Link>
        </div>
      </div>
      {isLoading || loading ? (
        <Loading color={PRIMARY_COLOR} />
      ) : error ? (
        <img
          src={theme === "light" ? error_warning : error_warning_dark}
          alt="error"
        />
      ) : (
        <div className="w-full md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[40vw] flex flex-col mt-2">
          {contactsSupport.map((contact: IContactSupportDTO) => (
            <ContactSupportCard
              key={contact.id}
              name={contact.name}
              email={contact.email}
              contactNumber={contact.contact_number}
              hideContactNumber={contact.hide_contact_number}
              onDeleteContact={() =>
                handleToggleDeleteSupportContactModal(contact)
              }
              onEditContact={() => handleToggleEditSupportContactModal(contact)}
            />
          ))}
        </div>
      )}
      <EditSupportContactModal
        contactData={selectedContactSupport!}
        isOpen={editContactSupportModal}
        onClose={handleToggleEditSupportContactModal}
        onRequestClose={handleToggleEditSupportContactModal as never}
        onConfirmAction={handleUpdateContactSupport as never}
        selectedContactSupportId={
          selectedContactSupport && selectedContactSupport.id
        }
      />
      <DeleteModal
        resource="contato"
        isOpen={deleteContactSupportModal}
        onRequestClose={handleToggleDeleteSupportContactModal as never}
        onClose={handleToggleDeleteSupportContactModal}
        onConfirmAction={() =>
          handleDeleteContactSupport(selectedContactSupport!)
        }
      />
    </main>
  );
}
