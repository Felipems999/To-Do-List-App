import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Checkbox,
    ListItemText,
    Select,
    InputLabel,
    FormControl,
    OutlinedInput,
    Box,
    Chip,
} from "@mui/material";
import type { Task, TaskFormProps } from "../type/task";

const TaskForm = ({
    open,
    onClose,
    onSave,
    categories,
    taskToEdit,
}: TaskFormProps) => {
    const [taskData, setTaskData] = useState<Partial<Task>>({
        title: "",
        description: "",
        categories: [],
    });

    useEffect(() => {
        if (open) {
            if (taskToEdit) {
                setTaskData({
                    ...taskToEdit,
                    categories: taskToEdit.categories || [],
                });
            } else {
                setTaskData({ title: "", description: "", categories: [] });
            }
        }
    }, [taskToEdit, open]);

    const handleSave = () => {
        onSave(taskData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}
            </DialogTitle>
            <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
            >
                <TextField
                    label="Título"
                    fullWidth
                    value={taskData.title || ""}
                    onChange={(e) =>
                        setTaskData({ ...taskData, title: e.target.value })
                    }
                    sx={{ mt: 1 }}
                />
                <TextField
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                    value={taskData.description || ""}
                    onChange={(e) =>
                        setTaskData({
                            ...taskData,
                            description: e.target.value,
                        })
                    }
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Categorias</InputLabel>
                    <Select
                        multiple
                        value={taskData.categories || []}
                        onChange={(e) => {
                            const { value } = e.target;
                            setTaskData({
                                ...taskData,
                                categories:
                                    typeof value === "string"
                                        ? value.split(",").map(Number)
                                        : value,
                            });
                        }}
                        input={<OutlinedInput label="Categorias" />}
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >
                                {categories
                                    .filter((cat) =>
                                        (selected as number[]).includes(cat.id),
                                    )
                                    .map((cat) => (
                                        <Chip
                                            key={cat.id}
                                            label={cat.name}
                                            size="small"
                                        />
                                    ))}
                            </Box>
                        )}
                    >
                        {categories.length === 0 ? (
                            <MenuItem disabled>
                                Nenhuma categoria cadastrada
                            </MenuItem>
                        ) : (
                            categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    <Checkbox
                                        checked={(
                                            taskData.categories || []
                                        ).includes(category.id)}
                                    />
                                    <ListItemText primary={category.name} />
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!taskData.title}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskForm;
