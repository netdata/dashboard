import React, { useCallback, useMemo, useEffect, useState } from "react"
import { useLocalStorage } from "react-use"
import { Button } from "@netdata/netdata-ui"
import News from "components/news"
import { fetchNews } from "./dataSource"

const AgentNews = () => {
  const [value, setValue] = useLocalStorage("news_last_seen")
  const [news, setNews] = useState([])

  useEffect(() => {
    fetchNews(({ results }) => setNews(results))
  }, [])

  const upToDate = useMemo(() => {
    if (!news.length) return true

    const [firstItem] = news
    const { last_publication_date: publishedAt } = firstItem

    const latestEntry = new Date(publishedAt)
    const lastSeen = new Date(value)
    return lastSeen >= latestEntry
  }, [value, news])

  const onClose = useCallback(() => {
    const now = new Date()
    setValue(now)
  }, [setValue])

  return (
    <News items={news} onCloseClick={onClose}>
      {toggle => (
        <Button
          name="news"
          title="News & Features"
          icon="insights"
          flavour="borderless"
          neutral={upToDate}
          warning={!upToDate}
          onClick={toggle}
        />
      )}
    </News>
  )
}
export default AgentNews
