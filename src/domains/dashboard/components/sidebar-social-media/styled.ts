import styled from "styled-components"
import { getSizeBy, getColor } from "@netdata/netdata-ui"

export const SocialMediaContainer = styled.div`
  width: 185px;
  padding: ${getSizeBy(2)};
  background: ${getColor("borderSecondary")};

  font-size: 12px;
  margin-bottom: ${getSizeBy(3)};
`

export const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
`

export const GithubCopy = styled.div`

`

export const GithubCopyLine = styled.div`

`

export const SocialMediaLink = styled.a`
  &, &:hover {
    color: ${getColor("main")};
  }
`

export const GithubStarQuestion = styled(SocialMediaLink)``

export const GithubIcon = styled(SocialMediaLink)`
  font-size: 24px;
`

export const TwitterIcon = styled(SocialMediaLink)`
  font-size: 17px;
`

export const FacebookIcon = styled(SocialMediaLink)`
  font-size: 23px;
`

export const Separator = styled.div`
  margin-top: ${getSizeBy(2)};
  border-top: 1px solid ${getColor("separator")};

`
export const SecondRow = styled.div`
  margin-top: ${getSizeBy(2)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const SecondRowText = styled.span`
  font-size: 10px;
`
