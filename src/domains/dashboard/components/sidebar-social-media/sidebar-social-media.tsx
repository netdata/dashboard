import React from "react"

import * as S from "./styled"

export const SidebarSocialMedia = () => (
  <S.SocialMediaContainer>
    <S.FirstRow>
      <S.GithubCopy>
        <S.GithubCopyLine>
            Do you like Netdata?
        </S.GithubCopyLine>
        <S.GithubStarQuestion href="https://github.com/netdata/netdata/" target="_blank">
            Give us a star?
        </S.GithubStarQuestion>
      </S.GithubCopy>
      <S.GithubIcon href="https://github.com/netdata/netdata/" target="_blank">
        <i className="fab fa-github" />
      </S.GithubIcon>
    </S.FirstRow>
    <S.Separator />
    <S.SecondRow>
      <S.SecondRowText>
          And share the word!
      </S.SecondRowText>
      <S.TwitterIcon href="https://twitter.com/linuxnetdata/" target="_blank">
        <i className="fab fa-twitter" />
      </S.TwitterIcon>
      <S.FacebookIcon href="https://www.facebook.com/linuxnetdata/" target="_blank">
        <i className="fab fa-facebook" />
      </S.FacebookIcon>
    </S.SecondRow>
  </S.SocialMediaContainer>
)
