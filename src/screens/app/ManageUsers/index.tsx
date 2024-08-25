import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { IUserDTO } from "@/repositories/interfaces/usersRepositoriesInterface";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
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

  const usersRepository = new UsersRepositories();
  const queryClient = useQueryClient();

  const getUsers = useCallback(async () => {
    try {
      const users = await usersRepository.listUsers();
      setUsers(users);
      return users;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const deleteUser = useCallback(
    async (userId: string) => {
      try {
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
      }
    },
    [queryClient]
  );

  const getUser = useCallback(async (userId: string) => {
    try {
      const user = await usersRepository.getUserById(userId);
      setSelectedUser(user);
      return users;
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
            <Loading />
          ) : error ? (
            <ErrorMessage errorMessage={error.message} />
          ) : (
            <UsersTable
              users={users}
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
        onConfirmAction={() => deleteUser(selectedUser!.id)}
      />
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={handleToggleEditUserModal}
        onRequestClose={handleToggleEditUserModal}
        onConfirmAction={() => console.log("User edited")}
      />
    </main>
  );
}
