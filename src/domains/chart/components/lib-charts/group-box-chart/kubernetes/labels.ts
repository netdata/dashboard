// @ts-nocheck

const labels = {
  k8s_cluster_id: { icon: "cluster", title: "Cluster Id" },
  k8s_node_name: { icon: "nodes_hollow", title: "Nodes" },
  k8s_namespace: { icon: "cluster_spaces", title: "Namespaces" },
  k8s_controller_kind: { icon: "cluster_spaces", title: "Controller Kind" },
  k8s_controller_name: { icon: "cluster_spaces", title: "Controller Name" },
  k8s_pod_name: { icon: "cluster_spaces", title: "Pod Name" },
  k8s_container_name: { icon: "cluster_spaces", title: "Container" },
}

const [, ...labelIds] = Object.keys(labels)

export { labelIds }

export const getLabelValues = (chartMetadata, attributes, labelId) => {
  return labelId === "k8s_node_name"
    ? attributes.nodeIDs.map(attributes.getName)
    : [chartMetadata.chartLabels[labelId]]
}

export default labels
