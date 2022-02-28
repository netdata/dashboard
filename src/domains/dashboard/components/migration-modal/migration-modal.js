import React from "react"

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
  const { migrationModalStatus } = useMigrationModal({
    userStatus: "LOGGED_IN",
    nodeClaimedStatus: "NOT_CLAIMED",
  })
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <H3>{migrationModalStatus.title}</H3>
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={1}>
            <Text>{migrationModalStatus.text.header}</Text>
            {migrationModalStatus.text.bullets.map(bullet => {
              if (typeof bullet === "function") {
                return bullet()
              }
              return <Text key={bullet}>{bullet}</Text>
            })}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box>
            <Checkbox label={migrationModalStatus.tickBoxOption.text} />
          </Box>
          {migrationModalStatus.CTA2 && (
            <Box margin={[0, 2, 0, 0]} width={{ min: 40 }}>
              <Button width="100%" label={migrationModalStatus.CTA2.text}></Button>
            </Box>
          )}
          <Box width={{ min: 40 }}>
            <Button width="100%" label={migrationModalStatus.CTA1.text}></Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MigrationModal
