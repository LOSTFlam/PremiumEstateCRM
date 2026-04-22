import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApi, putApi } from "../../services/api";
import { KanbanColumn } from "./KanbanColumn";
import { SkeletonCard } from "../skeletons/SkeletonCard";
import { Heading } from "../typography/Heading";

export function KanbanBoard() {
  const queryClient = useQueryClient();
  const [stages, setStages] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  const { isLoading: stagesLoading } = useQuery({
    queryKey: ["pipeline-stages"],
    queryFn: () => getApi("/api/pipeline/stages"),
    onSuccess: (data) => setStages(data.data || data),
  });

  const { isLoading: workflowsLoading } = useQuery({
    queryKey: ["pipeline-workflows"],
    queryFn: () => getApi("/api/pipeline/workflows"),
    onSuccess: (data) => setWorkflows(data.data || data),
  });

  const changeStage = useMutation({
    mutationFn: ({ workflowId, stageId }) =>
      putApi(`/api/pipeline/workflows/${workflowId}/stage`, { stageId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pipeline-workflows"]);
    },
  });

  const handleDrop = useCallback(
    (dealId, stageId) => {
      changeStage.mutate({ workflowId: dealId, stageId });
    },
    [changeStage]
  );

  if (stagesLoading || workflowsLoading) {
    return <SkeletonCard count={4} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading size="xl">Pipeline</Heading>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <AnimatePresence>
          {stages.map((stage, i) => (
            <motion.div
              key={stage._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <KanbanColumn
                stage={stage}
                deals={workflows.filter((w) => w.currentStage?._id === stage._id)}
                onDrop={handleDrop}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
