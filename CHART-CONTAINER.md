# chart-container component (dashboard.js)
Cloud and Dashboard (main.js) should use `<ChartContainer />` component.
 
### Supported props:

- `attributes`
is an object described by the following interface: [attributes](https://github.com/netdata/dashboard/blob/7349-performance-config-options/src/domains/chart/utils/transformDataAttributes.ts#L76-L281)
. The properties used here are the same as `[data-x]` attributes in [Custom Dashboards](https://docs.netdata.cloud/web/gui/custom/). 
- `chartId: string` - It should remain the same after page reload, so we can maintain the same configuration (like `height`), stored in localStorage (`chart-container` handles that)
- `playSetting` - setting for `Force Play`/`Play on Focus`/`Force Stop` Select
- `chartDetails` - result of `api/v1/chart` call
- `fetchMetrics: boolean`, default `false` - if `true`, the component fetches chart details (metadata) and metrics just like the old dashboard (using `server-detection` and `data-host` attribute)
- `onDataRequest: function` - that's a function that has the [same structure](https://github.com/netdata/dashboard/blob/6df8d6b91bd3154a90d5fdbd9e30c2371ce28923/src/domains/chart/sagas.ts#L22-L35) as `api/v1/data` call: `host`, `chart`, `points`, `after`, etc.
It will be called after mount, on internal interval clock and after user zooming/panning. That request should allow passing additional property, called `fetchDataParams`, which should be present in the data result (in `redux store`) 

There is no `data=` prop, because I think it's better to pass the data via `redux`, just like new dashboard does it now. One of reasons is that component can opt-out from rerender, when it's out of view (it will not react to `redux state` change).

  

### connecting `redux`
`<ChartContainer />` uses `redux` under the hood, which stores state for current selection, pan-and-zoom, common-min-and-max, common-colors, etc.

The npm module will also export a `middleware` which should be added to Cloud/Dashboard `redux store`.
```
applyMiddleware(..., chartsMiddleware)
```

Alternatively, we can discuss other options, like adding `dashboard.js` `reducers`, `sagas` manually.

Please be aware that parent apps will probably need access to `dashboard.js` `selectors` and `actions` (for example to resume/play buttons)


