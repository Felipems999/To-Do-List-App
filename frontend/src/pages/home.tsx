import { useEffect, useState, useMemo } from "react";
import {
    Container,
    Typography,
    Box,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import TaskForm from "../components/taskForm";
import serviceAPI from "../services/mainService";
import type { Task, Category } from "../type/task";
import HeaderMenu from "../components/headerMenu";
import CategoryForm from "../components/categoryForm";
import FilterStatus from "../components/filterStatus";
import TasksList from "../components/tasksList";

const HomePage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);

    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

    const [statusFilter, setStatusFilter] = useState<string | number>("all");
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (statusFilter === "all") return true;
            if (statusFilter === "completed") return task.is_completed;
            if (statusFilter === "pending") return !task.is_completed;

            return task.category === statusFilter;
        });
    }, [tasks, statusFilter]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [taskRes, catRes] = await Promise.all([
                serviceAPI.get<Task[]>("/tasks/tasks/"),
                serviceAPI.get<Category[]>("/tasks/categories/"),
            ]);
            setTasks(taskRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    const handleSaveTask = async (task: Partial<Task>) => {
        try {
            if (taskToEdit) {
                await serviceAPI.put(`/tasks/tasks/${taskToEdit.id}/`, task);
            } else {
                await serviceAPI.post("/tasks/tasks/", task);
            }
            fetchData();
            handleCloseDialog();
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
        }
    };

    const handleSaveCategory = async (name: string) => {
        try {
            await serviceAPI.post("/tasks/categories/", { name });
            fetchData();
        } catch (error) {
            console.error("Erro ao criar categoria", error);
        }
    };

    const handleCompleteTask = async (task: Task) => {
        try {
            await serviceAPI.patch(`/tasks/tasks/${task.id}/`, {
                is_completed: !task.is_completed,
            });
            fetchData();
        } catch (error) {
            console.error("Erro ao atualizar tarefa", error);
        }
    };

    const handleDeleteTask = async (task: Task) => {
        try {
            await serviceAPI.delete(`/tasks/tasks/${task.id}/`);
            fetchData();
        } catch (error) {
            console.error("Erro ao deletar tarefa", error);
        }
    };

    const handleOpenEditDialog = (task: Task) => {
        setTaskToEdit(task);
        setIsTaskFormOpen(true);
    };

    const handleCloseDialog = () => {
        setIsTaskFormOpen(false);
        setTaskToEdit(null);
    };

    const handleShareWith = async (taskId: number) => {
        const email = window.prompt(
            "Digite o e-mail do usuário para compartilhar:",
        );

        if (!email) return;

        try {
            await serviceAPI.post(`/tasks/tasks/${taskId}/share/`, { email });
            alert("Compartilhado com sucesso!");
        } catch (error) {
            console.error("Erro ao compartilhar no backend", error);
            alert("Erro: Verifique se o e-mail está correto.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
                margin: 0,
                padding: 0,
                overflowX: "hidden",
            }}
        >
            <HeaderMenu />
            <Container
                maxWidth="md"
                sx={{
                    mt: 4,
                    mb: 4,
                    flexGrow: 1,
                }}
            >
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Minhas Tarefas
                </Typography>

                <FilterStatus
                    statusFilter={statusFilter}
                    setStatusFilter={(e) =>
                        setStatusFilter(e.target.value as any)
                    }
                    categories={categories}
                />

                <TasksList
                    tasksList={filteredTasks}
                    handleCompleteTask={handleCompleteTask}
                    handleDeleteTask={handleDeleteTask}
                    handleOpenEditForm={handleOpenEditDialog}
                    handleShareWith={handleShareWith}
                />

                <SpeedDial
                    ariaLabel="Adicionar novo item"
                    sx={{ position: "fixed", bottom: 32, right: 32 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<FolderIcon />}
                        slotProps={{
                            tooltip: {
                                title: "Nova Categoria",
                                open: true,
                            },
                        }}
                        onClick={() => setIsCategoryFormOpen(true)}
                    />
                    <SpeedDialAction
                        icon={<AssignmentIcon />}
                        slotProps={{
                            tooltip: {
                                title: "Nova Tarefa",
                                open: true,
                            },
                        }}
                        onClick={() => setIsTaskFormOpen(true)}
                    />
                </SpeedDial>

                <TaskForm
                    open={isTaskFormOpen}
                    onClose={() => setIsTaskFormOpen(false)}
                    onSave={handleSaveTask}
                    categories={categories}
                    taskToEdit={taskToEdit}
                />
                <CategoryForm
                    open={isCategoryFormOpen}
                    onClose={() => setIsCategoryFormOpen(false)}
                    onSave={handleSaveCategory}
                />
            </Container>
        </Box>
    );
};

export default HomePage;
