// @ts-nocheck

const labels = {
  k8s_cluster_id: { icon: "cluster", title: "Cluster Id" },
  k8s_node_name: { icon: "nodes_hollow", title: "Nodes" },
  k8s_namespace: { icon: "cluster_spaces", title: "Namespaces" },
  k8s_controller_kind: { icon: "controller_kind", title: "Controller Kind" },
  k8s_controller_name: { icon: "controller_name", title: "Controller Name" },
  k8s_pod_name: { icon: "pod", title: "Pod Name" },
  k8s_container_name: { icon: "container", title: "Container" },
}

export const labelIds = Object.keys(labels)

export default (id) => {
  if (id in labels) return labels[id]
  // k8s_custom_label -> Custom Label
  const title = id.replace(/_./g, (word) => ` ${word[1].toUpperCase()}`).replace(/^k8s /, "")
  return { title, icon: "node" }
}
