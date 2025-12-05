import { Button } from "@/components/ui/button";

const TaskFormActions = ({ onClose, loading, isEditing }) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
      </Button>
    </div>
  );
};

export default TaskFormActions;
