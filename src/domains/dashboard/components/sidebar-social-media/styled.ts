import styled from "styled-components"
import { getSizeBy, getColor } from "@netdata/netdata-ui"
import { grayBombay, grayLimedSpruce } from "styles/layout-constants"

export const SocialMediaContainer = styled.div`
  width: 185px;
  padding: ${getSizeBy(2)};
  background: ${getColor(grayLimedSpruce)};
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

export const GithubStarQuestion = styled.a`
`

export const GithubIcon = styled.a`
  font-size: 24px;
`

export const TwitterIcon = styled.a`
  font-size: 17px;
`

export const FacebookIcon = styled.a`
  font-size: 23px;
`

export const Separator = styled.div`
  margin-top: ${getSizeBy(2)};
  border-top: 1px solid ${getColor(grayBombay)};
  
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
