import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";

import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { IUpdateUserDTO, IUserDTO } from "@/repositories/dtos/UserDTO";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { formatPhoneNumber } from "@/utils/formats";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { DeleteModal } from "../../../components/miscellaneous/DeleteModal";
import { EditUserModal } from "./components/EditUserModal";
import { UsersTable } from "./components/UsersTable";

export function ManageUsers() {
  const [isDeleteModalOpen, setIsDeleteModalUserOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditModalUserOpen] = useState(false);
  const [users, setUsers] = useState<IUserDTO[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUserDTO | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [phone, setPhone] = useState("");

  const usersRepository = new UsersRepositories();
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();

  const clearUpdateUserForm = () => {
    setPassword("");
    setPasswordConfirmation("");
    setPhone("");
  };

  const { isLoading: loading, setIsLoading } = useLoading();

  const getUsers = useCallback(async () => {
    try {
      const users = await usersRepository.listUsers();
      setUsers(users);
      return users;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        await usersRepository.deleteUser(userId);
        showAlertSuccess("Usuário deletado com sucesso");
        setIsDeleteModalUserOpen(false);
        queryClient.invalidateQueries(["users"] as InvalidateQueryFilters);
        return users;
      } catch (error) {
        showAlertError(
          "Houve um erro ao deletar usuário. Por favor, tente novamente mais tarde."
        );
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient]
  );

  const handleUpdateUser = useCallback(
    async (data: IUpdateUserDTO) => {
      try {
        setIsLoading(true);
        await usersRepository.updateUser(data);
        showAlertSuccess("Dados atualizados com sucesso");
        setIsEditModalUserOpen(false);
        clearUpdateUserForm();
        queryClient.invalidateQueries(["users"] as InvalidateQueryFilters);
        return users;
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          if (error.STATUS === 409) {
            showAlertError("Já existe um usuário com os dados fornecidos.");
          }
        } else {
          showAlertError(
            "Houve um erro ao tentar atualizar dados. Por favor, tente novamente mais tarde."
          );
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient]
  );

  const getUser = useCallback(async (userId: string) => {
    try {
      const user = await usersRepository.getUserById(userId);
      setSelectedUser(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleToggleEditUserModal = () => {
    setIsEditModalUserOpen(!isEditUserModalOpen);
  };
  const handleToggleDeleteModal = () => {
    setIsDeleteModalUserOpen(!isDeleteModalOpen);
  };

  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const { isLoading, error } = usersQuery;

  const PHONE_NUMBER_LENGTH = 11;

  return (
    <main className="flex flex-1 flex-col w-[90%] lg:w-full mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-4 ml-4">
            <ScreenTitleIcon screenTitle="Usuários" iconName="users" />
          </div>
        </div>
        <div className="lg:w-full flex-col flex md:items-center px-4">
          {isLoading ? (
            <div className="w-full mt-[10vh]">
              <Loading color={PRIMARY_COLOR} />
            </div>
          ) : error ? (
            <div className="w-full mt-[10vh] flex flex-col items-center justify-center">
              <img
                src={theme === "light" ? error_warning : error_warning_dark}
                alt="page_not_found"
                width={200}
                height={120}
              />
            </div>
          ) : (
            <UsersTable
              users={users}
              user={selectedUser!}
              onDeleteUser={handleToggleDeleteModal}
              onUpdateUser={handleToggleEditUserModal}
              onSelectUser={getUser}
            />
          )}
        </div>
      </div>
      <DeleteModal
        resource="usuário"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal}
        onConfirmAction={() => handleDeleteUser(selectedUser!.id)}
      />
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={handleToggleEditUserModal}
        onRequestClose={handleToggleEditUserModal}
        onConfirmAction={() =>
          handleUpdateUser({
            id: selectedUser!.id,
            phone:
              phone.length >= PHONE_NUMBER_LENGTH
                ? formatPhoneNumber(phone)
                : selectedUser!.phone,
            password: password ? password : selectedUser!.password,
          })
        }
        selectedUserId={selectedUser ? selectedUser.id : null}
        passwordConfirmation={passwordConfirmation}
        setPasswordConfirmation={setPasswordConfirmation}
        isLoading={loading}
        password={password}
        setPassword={setPassword}
        phone={phone}
        setPhone={setPhone}
      />
    </main>
  );
}
