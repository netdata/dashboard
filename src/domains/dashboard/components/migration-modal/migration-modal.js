import React, { useState } from "react"
import { useLocalStorage } from "react-use"

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

import useMigrationModal from "./use-migration-modal"

const MigrationModal = ({
  userStatus = "",
  nodeClaimedStatus = "",
  userNodeAccess = "",
  nodeLiveness = "",
}) => {
  const { migrationModalPromoInfo, migrationModalPromo } = useMigrationModal({
    userStatus,
    nodeClaimedStatus,
    userNodeAccess,
    nodeLiveness,
  })

  const [tickBoxPrefence, setTickBoxPrefence] = useLocalStorage(migrationModalPromo)
  const [isChecked, setChecked] = useState(tickBoxPrefence || false)

  const handleCheckBoxChange = e => {
    setChecked(e.currentTarget.checked)
    setTickBoxPrefence(e.currentTarget.checked)
  }

  return migrationModalPromoInfo ? (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <H3>{migrationModalPromoInfo.title}</H3>
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={3}>
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
              checked={isChecked}
              onChange={handleCheckBoxChange}
              label={migrationModalPromoInfo.tickBoxOption.text}
            />
          </Box>
          <Box data-testid="cta1" width={{ min: 40 }}>
            <Button width="100%" label={migrationModalPromoInfo.CTA1.text}></Button>
          </Box>
          {migrationModalPromoInfo.CTA2 && (
            <Box data-testid="cta2" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
              <Button width="100%" label={migrationModalPromoInfo.CTA2.text}></Button>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null
}

export default MigrationModal
