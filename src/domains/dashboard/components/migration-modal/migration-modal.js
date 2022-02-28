import React from "react"
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

const MigrationModal = () => {
  const { migrationModalPromoInfo } = useMigrationModal({
    userStatus: "LOGGED_IN",
    nodeClaimedStatus: "NOT_CLAIMED",
  })
  const [tickBoxPrefence, setTickBoxPrefence] = useLocalStorage("USER_SAVED_PREFERENCE")
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <H3>{migrationModalPromoInfo.title}</H3>
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={1}>
            {typeof migrationModalPromoInfo.text.header === "function" ? (
              <Text>{migrationModalPromoInfo.text.header()}</Text>
            ) : (
              <Text>{migrationModalPromoInfo.text.header}</Text>
            )}
            {migrationModalPromoInfo.text.bullets.map(bullet => {
              if (typeof bullet === "function") {
                return bullet()
              }
              return <Text key={bullet}>{bullet}</Text>
            })}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box>
            <Checkbox label={migrationModalPromoInfo.tickBoxOption.text} />
          </Box>
          {migrationModalPromoInfo.CTA2 && (
            <Box data-testid="cta2" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
              <Button width="100%" label={migrationModalPromoInfo.CTA2.text}></Button>
            </Box>
          )}
          <Box data-testid="cta1" width={{ min: 40 }}>
            <Button width="100%" label={migrationModalPromoInfo.CTA1.text}></Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MigrationModal
