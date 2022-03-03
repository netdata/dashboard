import React, { useCallback } from "react"

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
  ModalCloseButton,
} from "@netdata/netdata-ui"

import { ConnectionModalStatusContent } from "./types"

type CloudConnectionStatusModalProps = ConnectionModalStatusContent & {
  closeModal: () => void
  onRefresh?: () => void
  isCTA1Disabled: boolean
}

const CloudConnectionStatusModal = ({
  title,
  text,
  CTA1,
  closeModal,
  onRefresh,
  isCTA1Disabled,
}: CloudConnectionStatusModalProps) => {
  const handleClickedCTA1 = useCallback(() => {
    console.log("Lets go to netdata cloud")
    closeModal()
  }, [])

  return (
    <Modal>
      <ModalContent width={180} background="modalBackground">
        <ModalHeader>
          <H3 margin={[0]}>{title}</H3>
          <ModalCloseButton onClose={closeModal} />
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={3}>
            {text.header({})}
            {text.bullets.length > 0 && (
              <Flex column gap={3}>
                <Flex column gap={1} as={"ul"}>
                  {text.bullets.map(bullet => {
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
            {text.footer()}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box data-testid="cta1" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
            <Button
              disabled={isCTA1Disabled}
              textTransform="none"
              data-testid="cta1-button"
              onClick={handleClickedCTA1}
              width="100%"
              label={CTA1.text}
            ></Button>
          </Box>
          <Box
            onClick={onRefresh}
            height={10}
            className="btn btn-default"
            data-testid="cta2"
            width={{ min: 40 }}
          >
            <Box as={Text} sx={{ fontWeight: "500", lineHeight: "25px" }}>
              Check Now
            </Box>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CloudConnectionStatusModal
