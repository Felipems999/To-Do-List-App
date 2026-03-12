import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";
import type { TaskFormProps } from "../type/task";

const TaskForm = ({
    open,
    onClose,
    onSave,
    categories,
    taskToEdit,
}: TaskFormProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || "");
            setCategoryId(taskToEdit.category || "");
        } else {
            setTitle("");
            setDescription("");
            setCategoryId("");
        }
    }, [taskToEdit, open]);

    const handleSave = () => {
        onSave({ title, description, category: categoryId as number });
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                        mt: 1,
                    }}
                />
                <TextField
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    select
                    label="Categoria"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    fullWidth
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!title}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskForm;
