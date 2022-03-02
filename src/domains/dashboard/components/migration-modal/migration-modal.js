import React, { useState, useCallback } from "react"

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

const MigrationModal = ({
  migrationModalPromoInfo,
  setUserPrefrence,
  closeModal,
  savePromoRemindMeSelection,
}) => {
  const [isRememberChoiceChecked, setIsRememberChoiceChecked] = useState(false)

  const handleCheckBoxChange = e => {
    setIsRememberChoiceChecked(e.currentTarget.checked)
  }

  const handleClickedCTA1 = useCallback(() => {
    const { CTA1 } = migrationModalPromoInfo
    if (isRememberChoiceChecked) {
      setUserPrefrence(CTA1.userPreference)
      savePromoRemindMeSelection(isRememberChoiceChecked)
    }
    if (CTA1.action === "NAVIGATE") {
    } else if (CTA1.action === "REFRESH") {
    }
    closeModal()
  }, [migrationModalPromoInfo.CTA1, setUserPrefrence, isRememberChoiceChecked])

  const handleClickedCTA2 = useCallback(() => {
    const { CTA2 } = migrationModalPromoInfo
    if (isRememberChoiceChecked) {
      setUserPrefrence(CTA2.userPreference)
      savePromoRemindMeSelection(isRememberChoiceChecked)
    }
    if (CTA2.action === "NAVIGATE") {
    } else if (CTA2.action === "REFRESH") {
    }
    closeModal()
  }, [migrationModalPromoInfo.CTA2, setUserPrefrence, isRememberChoiceChecked])

  return migrationModalPromoInfo ? (
    <Modal>
      <ModalContent width={180} background="modalBackground">
        <ModalHeader>
          <H3 margin={[0]}>{migrationModalPromoInfo.title}</H3>
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={3}>
            {typeof migrationModalPromoInfo.text.header === "function" ? (
              migrationModalPromoInfo.text.header()
            ) : (
              <Text>{migrationModalPromoInfo.text.header}</Text>
            )}
            {migrationModalPromoInfo.text.bullets.length > 0 && (
              <Flex column gap={3}>
                <Flex column gap={1} as={"ul"}>
                  {migrationModalPromoInfo.text.bullets.map(bullet => {
                    if (typeof bullet === "function") {
                      return <li>{bullet()}</li>
                    }
                    return (
                      <li>
                        <Text key={bullet}>{bullet}</Text>
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
              data-testid="remind-me-checkbox"
              checked={isRememberChoiceChecked}
              onChange={handleCheckBoxChange}
              label={migrationModalPromoInfo.tickBoxOption.text}
            />
          </Box>
          <Box data-testid="cta1" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
            <Button
              data-testid="cta1-button"
              onClick={handleClickedCTA1}
              width="100%"
              label={migrationModalPromoInfo.CTA1.text}
            ></Button>
          </Box>
          {migrationModalPromoInfo.CTA2 && (
            <Box data-testid="cta2" width={{ min: 40 }}>
              <Button
                data-testid="cta2-button"
                danger
                onClick={handleClickedCTA2}
                width="100%"
                label={migrationModalPromoInfo.CTA2.text}
              ></Button>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null
}

export default MigrationModal
