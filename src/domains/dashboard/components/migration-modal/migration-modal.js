import React, { useState, useCallback } from "react"
import { useLocalStorage, useSessionStorage } from "react-use"

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

const MigrationModal = ({ migrationModalPromoInfo, setUserPrefrence, closeModal }) => {
  const [tickBoxPrefence, setTickBoxPrefence] = useLocalStorage(
    migrationModalPromoInfo && migrationModalPromoInfo.tickBoxOption.prefrenceID
  )
  const [isRememberChoiceChecked, setIsRememberChoiceChecked] = useState(false)

  const handleCheckBoxChange = e => {
    setIsRememberChoiceChecked(e.currentTarget.checked)
  }

  const handleClickedCTA1 = useCallback(() => {
    const { CTA1 } = migrationModalPromoInfo
    if (isRememberChoiceChecked) {
      console.log("i will save option for CTA1")
      setUserPrefrence(CTA1.userPreference)
      setTickBoxPrefence(isRememberChoiceChecked)
    }
    if (CTA1.action === "NAVIGATE") {
      console.log("I will navigate to ", CTA1.toPath)
    } else if (CTA1.action === "REFRESH") {
      console.log("I REFRESH THE DATA")
    }
    closeModal()
  }, [migrationModalPromoInfo.CTA1, setUserPrefrence, isRememberChoiceChecked])

  const handleClickedCTA2 = useCallback(() => {
    const { CTA2 } = migrationModalPromoInfo
    if (isRememberChoiceChecked) {
      console.log("i will save option for CTA2")
      setUserPrefrence(CTA2.userPreference)
      setTickBoxPrefence(isRememberChoiceChecked)
    }
    if (CTA2.action === "NAVIGATE") {
      console.log("I will navigate to ", CTA2.toPath)
    } else if (CTA2.action === "REFRESH") {
      console.log("I REFRESH THE DATA")
    }
    closeModal()
  }, [migrationModalPromoInfo.CTA2, setUserPrefrence, isRememberChoiceChecked])

  return migrationModalPromoInfo ? (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <H3>{migrationModalPromoInfo.title}</H3>
        </ModalHeader>
        <ModalBody>
          <Flex width={120} padding={[0, 0, 4, 0]} column gap={3}>
            {typeof migrationModalPromoInfo.text.header === "function" ? (
              <Text>{migrationModalPromoInfo.text.header()}</Text>
            ) : (
              <Text>{migrationModalPromoInfo.text.header}</Text>
            )}
            <Flex column gap={3}>
              {migrationModalPromoInfo.text.bullets.map(bullet => {
                if (typeof bullet === "function") {
                  return bullet()
                }
                return <Text key={bullet}>{bullet}</Text>
              })}
            </Flex>
            {migrationModalPromoInfo.text.footer && (
              <Text data-testid="body-footer">{migrationModalPromoInfo.text.footer}</Text>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box margin={[0, 2, 0, 0]}>
            <Checkbox
              data-testId="remind-me-checkbox"
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
