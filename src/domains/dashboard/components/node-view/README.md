# How to use NodeView

For now the current route (top visible chart) is handled by parent (for example Cloud). this is how it can be done:

```
const getCurrentRouteFromHash = () => document.location.hash.split(";")[0].replace("#", "")
```

and in component:
```
  const [currentRoute, setCurrentRoute] = useState(() => getCurrentRouteFromHash())


  return (
    <div style={{ height: "100vh" }}>
      {chartsMetadata && (
        <NodeView
          chartsMetadata={chartsMetadata as unknown as ChartsMetadata}
          currentChart={currentRoute}
          setCurrentChart={(chart: string) => {
            if (currentRoute !== chart) {
              setCurrentRoute(chart)
              window.history.replaceState(null, "", `#${chart}`)
            }
          }}
        />
      )}
    </div>
  )
```
