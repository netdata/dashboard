import React, { useState, useCallback } from "react"
import GoToCloud from "components/auth/signIn"

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  Flex,
  H3,
  Button,
  Box,
  Checkbox,
} from "@netdata/netdata-ui"

const campaign = "agent_nudge_to_cloud"

const MigrationModal = ({
  migrationModalPromoInfo,
  setUserPrefrence,
  closeModal,
  savePromoRemindMeSelection,
  migrationModalPromo,
  requestRefreshOfAccess,
}) => {
  const [isRememberChoiceChecked, setIsRememberChoiceChecked] = useState(false)

  const handleCheckBoxChange = e => {
    setIsRememberChoiceChecked(e.currentTarget.checked)
  }

  const handleClickedCTA1 = useCallback(
    ({ link, toPath }) => {
      const { CTA1 } = migrationModalPromoInfo

      if (CTA1.action === "NAVIGATE") {
        if (isRememberChoiceChecked) {
          setUserPrefrence(CTA1.userPreference)
          savePromoRemindMeSelection(isRememberChoiceChecked)
        }
        if (toPath !== "agent") window.location.href = link
        closeModal()
      } else if (CTA1.action === "REFRESH") {
        requestRefreshOfAccess()
      }
    },
    [
      migrationModalPromoInfo,
      setUserPrefrence,
      isRememberChoiceChecked,
      requestRefreshOfAccess,
      savePromoRemindMeSelection,
      closeModal,
    ]
  )

  const handleClickedCTA2 = useCallback(() => {
    const { CTA2 } = migrationModalPromoInfo
    if (isRememberChoiceChecked) {
      setUserPrefrence(CTA2.userPreference)
      savePromoRemindMeSelection(isRememberChoiceChecked)
    }
    if (CTA2.action === "NAVIGATE") {
    } else if (CTA2.action === "REFRESH") {
      requestRefreshOfAccess()
    }
    closeModal()
  }, [
    migrationModalPromoInfo,
    setUserPrefrence,
    isRememberChoiceChecked,
    requestRefreshOfAccess,
    savePromoRemindMeSelection,
    closeModal,
  ])

  return migrationModalPromoInfo ? (
    <Modal>
      <ModalContent width={180} background="modalBackground">
        <ModalHeader>
          <H3 margin={[0]}>{migrationModalPromoInfo.title}</H3>
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={3}>
            {typeof migrationModalPromoInfo.text.header === "function" ? (
              migrationModalPromoInfo.text.header({})
            ) : (
              <Text>{migrationModalPromoInfo.text.header}</Text>
            )}
            {migrationModalPromoInfo.text.bullets.length > 0 && (
              <Flex column gap={3}>
                <Flex column gap={1} as={"ul"}>
                  {migrationModalPromoInfo.text.bullets.map(bullet => {
                    if (typeof bullet === "function") {
                      return <li key={bullet}>{bullet()}</li>
                    }
                    return (
                      <li key={bullet}>
                        <Text>{bullet}</Text>
                      </li>
                    )
                  })}
                </Flex>
              </Flex>
            )}
            {migrationModalPromoInfo.text.footer && (
              <Text data-testid="body-footer">{migrationModalPromoInfo.text.footer}</Text>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box margin={[0, "auto", 0, 0]}>
            <Checkbox
              data-ga={`${migrationModalPromo}::click-remind-me::ad`}
              data-testid="remind-me-checkbox"
              checked={isRememberChoiceChecked}
              onChange={handleCheckBoxChange}
              label={migrationModalPromoInfo.tickBoxOption.text}
            />
          </Box>
          <Box data-testid="cta1" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
            <GoToCloud utmParameters={{ content: migrationModalPromo, campaign }}>
              {({ link }) => (
                <Button
                  data-ga={`${migrationModalPromo}::click-ct1::ad`}
                  textTransform="none"
                  data-testid="cta1-button"
                  onClick={() =>
                    handleClickedCTA1({ link, toPath: migrationModalPromoInfo.CTA1.toPath })
                  }
                  width="100%"
                  label={migrationModalPromoInfo.CTA1.text}
                />
              )}
            </GoToCloud>
          </Box>
          {migrationModalPromoInfo.CTA2 && (
            <Box
              data-ga={`${migrationModalPromo}::click-ct2::ad`}
              onClick={handleClickedCTA2}
              height={10}
              className="btn btn-default"
              data-testid="cta2"
              width={{ min: 40 }}
            >
              <Box as={Text} sx={{ fontWeight: "500", lineHeight: "25px" }}>
                {migrationModalPromoInfo.CTA2.text}
              </Box>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null
}

export default MigrationModal
