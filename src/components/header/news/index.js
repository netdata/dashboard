import React, { useCallback, useMemo, useEffect, useState } from "react"
import { useLocalStorage } from "react-use"
import News from "components/news"
import Item from "components/header/item"
import Pill from "components/header/pill"
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
    <Item hasBorder>
      <News items={news} onCloseClick={onClose}>
        {toggle => (
          <Pill color="bright" background={upToDate ? "border" : "success"} onClick={toggle}>
            NEWS
          </Pill>
        )}
      </News>
    </Item>
  )
}
export default AgentNews
