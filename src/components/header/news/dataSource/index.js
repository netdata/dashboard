import Prismic from "@prismicio/client"

const apiEndpoint = "https://netdata-news.cdn.prismic.io/api/v2"
const client = Prismic.client(apiEndpoint)

export const fetchNews = async onSuccess => {
  const response = await client.query(
    Prismic.Predicates.at("document.type", "news__announcements"),
    { pageSize: 100, orderings: "[document.last_publication_date desc]" }
  )
  if (!response) return
  if (onSuccess) onSuccess(response)
}
