import type { Server } from 'node:http'
import { serve } from '../serve'
import * as utils from '../utils'
import {
  botHandler,
  MessageHandlersMap,
  MessageHandlers,
  EventHandlersMap,
  EventHandlers,
  StateExpiredHandlersMap,
  StateExpiredHandlers,
  HookImplementationsMap,
  HookDefinitions,
  HookImplementations,
  ActionHandlers,
  BotHandlers,
} from './server'
import { BaseBot } from './types'

export type BotImplementationProps<TBot extends BaseBot = BaseBot> = {
  actions: ActionHandlers<TBot>
}

export class BotImplementation<TBot extends BaseBot = BaseBot> implements BotHandlers<TBot> {
  public readonly actionHandlers: ActionHandlers<TBot>
  public readonly messageHandlers: MessageHandlersMap<TBot> = {}
  public readonly eventHandlers: EventHandlersMap<TBot> = {}
  public readonly stateExpiredHandlers: StateExpiredHandlersMap<TBot> = {}
  public readonly hookHandlers: HookImplementationsMap<TBot> = {
    before_incoming_event: {},
    before_incoming_message: {},
    before_outgoing_message: {},
    before_outgoing_call_action: {},
    after_incoming_event: {},
    after_incoming_message: {},
    after_outgoing_message: {},
    after_outgoing_call_action: {},
  }

  public constructor(public readonly props: BotImplementationProps<TBot>) {
    this.actionHandlers = props.actions
  }

  public readonly message = <T extends keyof MessageHandlersMap<TBot>>(
    type: T,
    handler: MessageHandlers<TBot>[T]
  ): void => {
    this.messageHandlers[type] = utils.arrays.safePush(this.messageHandlers[type], handler)
  }

  public readonly event = <T extends keyof EventHandlersMap<TBot>>(type: T, handler: EventHandlers<TBot>[T]): void => {
    this.eventHandlers[type] = utils.arrays.safePush(this.eventHandlers[type], handler)
  }

  public readonly stateExpired = <T extends keyof StateExpiredHandlersMap<TBot>>(
    type: T,
    handler: StateExpiredHandlers<TBot>[T]
  ): void => {
    this.stateExpiredHandlers[type] = utils.arrays.safePush(this.stateExpiredHandlers[type], handler)
  }

  public readonly hook = {
    beforeIncomingEvent: <T extends keyof HookDefinitions<TBot>['before_incoming_event']>(
      type: T,
      handler: HookImplementations<TBot>['before_incoming_event'][T]
    ) => {
      this.hookHandlers.before_incoming_event[type] = utils.arrays.safePush(
        this.hookHandlers.before_incoming_event[type],
        handler
      )
    },
    beforeIncomingMessage: <T extends keyof HookDefinitions<TBot>['before_incoming_message']>(
      type: T,
      handler: HookImplementations<TBot>['before_incoming_message'][T]
    ) => {
      this.hookHandlers.before_incoming_message[type] = utils.arrays.safePush(
        this.hookHandlers.before_incoming_message[type],
        handler
      )
    },
    beforeOutgoingMessage: <T extends keyof HookDefinitions<TBot>['before_outgoing_message']>(
      type: T,
      handler: HookImplementations<TBot>['before_outgoing_message'][T]
    ) => {
      this.hookHandlers.before_outgoing_message[type] = utils.arrays.safePush(
        this.hookHandlers.before_outgoing_message[type],
        handler
      )
    },
    beforeOutgoingCallAction: <T extends keyof HookDefinitions<TBot>['before_outgoing_call_action']>(
      type: T,
      handler: HookImplementations<TBot>['before_outgoing_call_action'][T]
    ) => {
      this.hookHandlers.before_outgoing_call_action[type] = utils.arrays.safePush(
        this.hookHandlers.before_outgoing_call_action[type],
        handler
      )
    },
    afterIncomingEvent: <T extends keyof HookDefinitions<TBot>['after_incoming_event']>(
      type: T,
      handler: HookImplementations<TBot>['after_incoming_event'][T]
    ) => {
      this.hookHandlers.after_incoming_event[type] = utils.arrays.safePush(
        this.hookHandlers.after_incoming_event[type],
        handler
      )
    },
    afterIncomingMessage: <T extends keyof HookDefinitions<TBot>['after_incoming_message']>(
      type: T,
      handler: HookImplementations<TBot>['after_incoming_message'][T]
    ) => {
      this.hookHandlers.after_incoming_message[type] = utils.arrays.safePush(
        this.hookHandlers.after_incoming_message[type],
        handler
      )
    },
    afterOutgoingMessage: <T extends keyof HookDefinitions<TBot>['after_outgoing_message']>(
      type: T,
      handler: HookImplementations<TBot>['after_outgoing_message'][T]
    ) => {
      this.hookHandlers.after_outgoing_message[type] = utils.arrays.safePush(
        this.hookHandlers.after_outgoing_message[type],
        handler
      )
    },
    afterOutgoingCallAction: <T extends keyof HookDefinitions<TBot>['after_outgoing_call_action']>(
      type: T,
      handler: HookImplementations<TBot>['after_outgoing_call_action'][T]
    ) => {
      this.hookHandlers.after_outgoing_call_action[type] = utils.arrays.safePush(
        this.hookHandlers.after_outgoing_call_action[type],
        handler
      )
    },
  }

  public readonly handler = botHandler(this as BotHandlers<any>)

  public readonly start = (port?: number): Promise<Server> => serve(this.handler, port)
}
